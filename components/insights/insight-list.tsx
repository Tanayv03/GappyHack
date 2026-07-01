"use client"

import Link from "next/link"
import { useInsights, useNotes } from "@/hooks/use-lemma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  LightbulbIcon,
  HelpCircleIcon,
  ListTodoIcon,
  LinkIcon,
  FileTextIcon,
  TrendingUpIcon,
} from "lucide-react"
import { getSourceRefs } from "@/lib/knowledge-metadata"

const typeConfig: Record<
  string,
  { icon: typeof LightbulbIcon; color: string }
> = {
  key_point: {
    icon: LightbulbIcon,
    color: "text-yellow-600 dark:text-yellow-400",
  },
  question: {
    icon: HelpCircleIcon,
    color: "text-blue-600 dark:text-blue-400",
  },
  action_item: {
    icon: ListTodoIcon,
    color: "text-green-600 dark:text-green-400",
  },
  connection: {
    icon: LinkIcon,
    color: "text-purple-600 dark:text-purple-400",
  },
  summary: {
    icon: FileTextIcon,
    color: "text-gray-600 dark:text-gray-400",
  },
  pattern: {
    icon: TrendingUpIcon,
    color: "text-orange-600 dark:text-orange-400",
  },
}

export function InsightList() {
  const { records: insights, isLoading } = useInsights()
  const { records: notes } = useNotes()
  const noteMap = new Map(notes.map((note: Record<string, unknown>) => [note.id as string, note]))

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    )
  }

  if (insights.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-16">
        <div className="rounded-2xl bg-muted/50 p-6">
          <LightbulbIcon className="size-10 text-muted-foreground/40" />
        </div>
        <div className="text-center">
          <p className="font-medium text-muted-foreground">No insights yet</p>
          <p className="mt-1 text-sm text-muted-foreground/60">
            Process notes with AI to extract insights automatically.
          </p>
        </div>
        <Button variant="outline" render={<Link href="/notes" />}>
          Go to Notes
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {insights.map((insight: Record<string, unknown>) => {
        const config = typeConfig[(insight.type as string) ?? "key_point"] ?? typeConfig.key_point
        const Icon = config.icon
        const sourceRefs = getSourceRefs(insight.metadata)

        return (
          <Card key={insight.id as string} className="transition-shadow hover:shadow-sm">
            <CardContent className="flex items-start gap-3 py-3">
              <Icon className={`mt-0.5 size-4 shrink-0 ${config.color}`} />
              <div className="flex-1 space-y-1">
                <p className="text-sm">{insight.content as string}</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {(insight.type as string)?.replace("_", " ")}
                  </Badge>
                  {(insight.confidence as number) != null && (
                    <span className="text-[10px] text-muted-foreground">
                      {((insight.confidence as number) * 100).toFixed(0)}% confidence
                    </span>
                  )}
                  {insight.note_id && noteMap.has(insight.note_id as string) ? (
                    <Link
                      href={`/notes?open=${encodeURIComponent(insight.note_id as string)}`}
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground"
                    >
                      <FileTextIcon className="size-3" />
                      From: {String(noteMap.get(insight.note_id as string)?.title ?? "note")}
                    </Link>
                  ) : null}
                  {sourceRefs.slice(0, 2).map((source, index) => (
                    <span
                      key={`${source.type}-${source.id ?? source.url ?? source.path ?? index}`}
                      className="inline-flex items-center gap-1 text-[10px] text-muted-foreground"
                    >
                      <FileTextIcon className="size-3" />
                      {source.title ?? source.path ?? source.url ?? source.type}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
