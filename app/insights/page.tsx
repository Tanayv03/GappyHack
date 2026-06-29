"use client"

import { InsightList } from "@/components/insights/insight-list"

export default function InsightsPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Key points, questions, connections, and patterns extracted from your notes.
        </p>
      </div>
      <InsightList />
    </div>
  )
}
