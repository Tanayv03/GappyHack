"use client"

import { DocumentUpload } from "@/components/documents/document-upload"

export default function DocumentsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
        <p className="text-sm text-muted-foreground">
          Upload files to your knowledge base. They&apos;re auto-indexed for semantic search.
        </p>
      </div>
      <DocumentUpload />
    </div>
  )
}
