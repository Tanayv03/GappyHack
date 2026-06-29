"use client"

import { TaskList } from "@/components/tasks/task-list"

export default function TasksPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Tasks</h1>
        <p className="text-sm text-muted-foreground">
          Action items extracted from your notes by AI.
        </p>
      </div>
      <TaskList />
    </div>
  )
}

