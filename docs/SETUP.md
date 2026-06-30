# AI Second Brain — Lemma Pod Setup

Complete guide to recreating the Lemma backend pod for the Second Brain app.

## Prerequisites

- [Lemma CLI](https://docs.lemma.work) installed and authenticated (`lemma auth login`)
- A Lemma organization (`lemma orgs list`)

## 1. Create the Pod

```bash
lemma pods create --name "Second Brain"
```

Note your Pod ID from the output — you'll need it for `.env.local`.

## 2. Create Tables

All tables use RLS (row-level security) by default — each user only sees their own data.

### notes

Stores user-created notes, articles, and bookmarks.

```bash
lemma tables create notes --columns '{
  "title": "text",
  "content": "text",
  "type": {"type": "enum", "options": ["note", "article", "bookmark"]},
  "source_url": "text",
  "tags": "json",
  "summary": "text",
  "processed": "boolean",
  "metadata": "json"
}'
```

### insights

AI-extracted insights from processed notes.

```bash
lemma tables create insights --columns '{
  "content": "text",
  "type": {"type": "enum", "options": ["key_point", "question", "action_item", "connection", "pattern"]},
  "note_id": "uuid",
  "confidence": "float",
  "metadata": "json"
}'
```

### connections

Links between related notes discovered by AI.

```bash
lemma tables create connections --columns '{
  "source_id": "uuid",
  "target_id": "uuid",
  "relationship": "text",
  "strength": "float",
  "metadata": "json"
}'
```

### tasks

Action items extracted from notes.

```bash
lemma tables create tasks --columns '{
  "title": "text",
  "description": "text",
  "note_id": "uuid",
  "priority": {"type": "enum", "options": ["low", "medium", "high"]},
  "status": {"type": "enum", "options": ["pending", "in_progress", "done"]},
  "due_date": "date",
  "metadata": "json"
}'
```

## 3. Create the Knowledge Folder

```bash
lemma files mkdir /knowledge
```

This is where uploaded documents (PDF, DOCX, etc.) are stored and auto-indexed for semantic search.

## 4. Create Agents

### librarian

The intake processor — extracts insights, tags, summaries, and connections from new notes.

```bash
lemma agents create librarian \
  --description "Processes new knowledge: extracts insights, tags content, discovers connections between notes, and generates summaries." \
  --toolsets POD,WORKSPACE_CLI \
  --instruction-file docs/agents/librarian-instruction.md
```

**Grants** (read + write on all tables, read on /knowledge):

```bash
lemma agents grant librarian --resource notes --resource-type datastore_table \
  --permissions datastore.record.read,datastore.record.write,datastore.table.read

lemma agents grant librarian --resource connections --resource-type datastore_table \
  --permissions datastore.record.read,datastore.record.write,datastore.table.read

lemma agents grant librarian --resource insights --resource-type datastore_table \
  --permissions datastore.record.read,datastore.record.write,datastore.table.read

lemma agents grant librarian --resource tasks --resource-type datastore_table \
  --permissions datastore.record.read,datastore.record.write,datastore.table.read

lemma agents grant librarian --resource /knowledge --resource-type folder \
  --permissions folder.read
```

### oracle

The retrieval and reasoning agent — answers questions from the knowledge base.

```bash
lemma agents create oracle \
  --description "Retrieval and reasoning agent: answers questions from the knowledge base, surfaces forgotten context, and helps turn knowledge into tasks, drafts, or decisions." \
  --toolsets POD,WEB_SEARCH,WORKSPACE_CLI \
  --instruction-file docs/agents/oracle-instruction.md
```

**Grants** (read on notes/connections/insights, read+write on tasks, read on /knowledge):

```bash
lemma agents grant oracle --resource notes --resource-type datastore_table \
  --permissions datastore.record.read,datastore.table.read

lemma agents grant oracle --resource connections --resource-type datastore_table \
  --permissions datastore.record.read,datastore.table.read

lemma agents grant oracle --resource insights --resource-type datastore_table \
  --permissions datastore.record.read,datastore.table.read

lemma agents grant oracle --resource tasks --resource-type datastore_table \
  --permissions datastore.record.read,datastore.record.write,datastore.table.read

lemma agents grant oracle --resource /knowledge --resource-type folder \
  --permissions folder.read
```

## 5. Create the Workflow

### process-note

A 3-node workflow: **Form (intake) → Agent (librarian) → End**

```bash
lemma workflows create process-note \
  --description "Processes a newly added note: the librarian extracts insights, discovers connections, generates summary and tags." \
  --nodes '[
    {
      "id": "intake",
      "type": "FORM",
      "label": "Note Input",
      "config": {
        "input_schema": {
          "type": "object",
          "required": ["note_id"],
          "properties": {
            "note_id": {
              "type": "string",
              "description": "ID of the note to process"
            }
          }
        }
      }
    },
    {
      "id": "process",
      "type": "AGENT",
      "label": "Librarian Processing",
      "config": {
        "agent_name": "librarian",
        "input_mapping": {
          "note_id": {
            "value": "intake.note_id",
            "optional": false,
            "type": "expression"
          }
        }
      }
    },
    {
      "id": "end",
      "type": "END",
      "label": "Done",
      "config": {}
    }
  ]' \
  --edges '[
    {"id": "e1", "source": "intake", "target": "process"},
    {"id": "e2", "source": "process", "target": "end"}
  ]' \
  --start '{"type": "MANUAL"}'
```

**To trigger manually:**

```bash
lemma workflows run process-note --data '{"note_id": "<NOTE_UUID>"}'
```

## 6. Agent Instructions

The agent instructions are the core of how the AI processes and retrieves knowledge. Save these as files and pass them via `--instruction-file` when creating agents, or update existing agents with `lemma agents update <name> --instruction-file <path>`.

### librarian instruction

```markdown
# librarian

You are **librarian**, the knowledge processing agent for this second brain pod.

## Role

You process new notes, extract structured insights, discover connections between
pieces of knowledge, and keep the knowledge graph organized.

## How to read and write data

Use POD tools to **read** tables. For **all writes**, use the `lemma` CLI:

### Reading
Use POD tools: `pod_read_record`, `pod_list_records`, `pod_query`.

### Writing — use the CLI

**Update a record:**
```bash
lemma records update <table> <record-id> --data '{"column": "value"}'
```

**Create a record:**
```bash
lemma records create <table> --data '{"column": "value"}'
```

## What you do

### 1. Process new notes
When given a note (by ID), you:
- Read the full content using POD tools
- Generate a concise summary (2-3 sentences max)
- Extract tags as a JSON array of lowercase strings
- Update the note:
  ```bash
  lemma records update notes <note-id> --data '{"summary": "...", "tags": ["tag1", "tag2"], "processed": true}'
  ```

### 2. Extract insights
Create rows in `insights` using CLI:
```bash
lemma records create insights --data '{"content": "insight text", "type": "key_point", "note_id": "<id>", "confidence": 0.8}'
```
Types: **key_point**, **question**, **action_item**, **connection**, **pattern**

### 3. Discover connections
Query existing notes, create connections:
```bash
lemma records create connections --data '{"source_id": "<this-note>", "target_id": "<related-note>", "relationship": "description", "strength": 0.8}'
```

### 4. Create tasks from action items
```bash
lemma records create tasks --data '{"title": "action item", "note_id": "<id>", "priority": "medium", "status": "pending"}'
```

## Table schemas
- **notes**: id, title, content, type, source_url, tags (json), summary, processed (bool), metadata
- **insights**: id, content, type (enum), note_id, confidence (float), metadata
- **connections**: id, source_id, target_id, relationship, strength (float), metadata
- **tasks**: id, title, note_id, priority, status, metadata

## Boundaries
- Never delete notes or insights — only add or update
- Keep summaries concise
- Always set `processed: true` after completing processing
```

### oracle instruction

```markdown
# oracle

You are **oracle**, the retrieval and reasoning agent for this second brain pod.

## Role

You help the user find, connect, and act on their stored knowledge. You search
across notes, files, and insights to answer questions and surface forgotten context.

## How to read data — use the CLI

```bash
lemma records list notes --limit 50
lemma query run "SELECT id, title, summary, tags, processed FROM notes"
lemma query run "SELECT * FROM insights WHERE note_id = '<id>'"
lemma query run "SELECT c.*, n1.title as source_title, n2.title as target_title FROM connections c JOIN notes n1 ON c.source_id = n1.id JOIN notes n2 ON c.target_id = n2.id"
lemma files search "query" --scope /knowledge
```

## What you do

### 1. Answer questions from the knowledge base
- List all notes to see the full knowledge base
- Query insights and connections for pre-extracted knowledge
- Search `/knowledge` for uploaded documents
- Synthesize a clear answer citing specific note titles

### 2. Surface forgotten context
- Find related notes through the connections table
- Highlight insights the user may have forgotten

### 3. Help turn knowledge into action
- Create tasks via CLI when needed:
  ```bash
  lemma records create tasks --data '{"title": "task text", "note_id": "<id>", "priority": "medium", "status": "pending"}'
  ```

### 4. Knowledge exploration
- Show connections between topics
- Identify knowledge gaps
- Summarize topics by aggregating notes and insights

## Table schemas
- **notes**: id, title, content, type, source_url, tags (json), summary, processed (bool), metadata
- **insights**: id, content, type (enum), note_id, confidence (float), metadata
- **connections**: id, source_id, target_id, relationship, strength (float), metadata
- **tasks**: id, title, note_id, priority, status, metadata

## Response style
- Always cite note titles when drawing from them
- Be concise — give the answer first, details second
- Give ONE cohesive response, not multiple intermediate messages
- If the knowledge base doesn't have enough to answer, say so clearly

## Boundaries
- Can create/update tasks, but cannot modify notes or insights
- Never fabricate knowledge — only report what's in the pod
- When using web search, clearly distinguish external info from user's notes
```

## 7. Frontend Environment

Create `.env.local` in the Next.js project root:

```env
NEXT_PUBLIC_LEMMA_API_URL=/lemma-api
NEXT_PUBLIC_LEMMA_AUTH_URL=https://lemma.work/auth
NEXT_PUBLIC_LEMMA_POD_ID=<your-pod-id>
NEXT_PUBLIC_LEMMA_ORG_ID=<your-org-id>
```

For production (Vercel), set `NEXT_PUBLIC_LEMMA_API_URL` to the real Lemma API URL (e.g. `https://api.lemma.work`).

## 8. Verify Setup

```bash
lemma pods describe          # should show 4 tables, 2 agents, 1 workflow
lemma tables list            # notes, connections, insights, tasks
lemma agents list            # oracle, librarian
lemma workflows list         # process-note
lemma files ls /knowledge    # should exist (empty is fine)
```

## Quick Test

1. Create a test note:
   ```bash
   lemma records create notes --data '{"title": "Test Note", "content": "The Feynman Technique is a learning method where you explain a concept in simple terms.", "type": "note", "processed": false}'
   ```

2. Get the note ID from the output, then trigger processing:
   ```bash
   lemma workflows run process-note --data '{"note_id": "<NOTE_ID>"}'
   ```

3. Check that it was processed:
   ```bash
   lemma records list notes --limit 5
   lemma records list insights --limit 10
   ```
