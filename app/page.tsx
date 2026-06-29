"use client"

import { useNotes, useInsights, useTasks } from "@/hooks/use-lemma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  BrainIcon,
  FileTextIcon,
  LightbulbIcon,
  ListTodoIcon,
  SparklesIcon,
  ArrowRightIcon,
  PlusIcon,
  MessageCircleIcon,
  UploadIcon,
  CalendarIcon,
} from "lucide-react"

function StatCard({
  title,
  value,
  icon: Icon,
  href,
  gradient,
}: {
  title: string
  value: number | string
  icon: typeof FileTextIcon
  href: string
  gradient: string
}) {
  return (
    <Link href={href}>
      <Card className="group transition-all hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 py-4">
          <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3`}>
            <Icon className="size-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground">{title}</p>
          </div>
          <ArrowRightIcon className="size-4 text-muted-foreground/30 transition-transform group-hover:translate-x-0.5 group-hover:text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  )
}

function QuickAction({
  title,
  description,
  icon: Icon,
  href,
}: {
  title: string
  description: string
  icon: typeof FileTextIcon
  href: string
}) {
  return (
    <Link href={href}>
      <Card className="group h-full transition-all hover:shadow-md hover:shadow-primary/5 hover:-translate-y-0.5">
        <CardContent className="flex flex-col gap-3 py-4">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted/80 transition-colors group-hover:bg-primary/10">
            <Icon className="size-5 text-muted-foreground group-hover:text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">{title}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function DashboardPage() {
  const { records: notes, isLoading: notesLoading } = useNotes()
  const { records: insights, isLoading: insightsLoading } = useInsights()
  const { records: tasks, isLoading: tasksLoading } = useTasks()

  const isLoading = notesLoading || insightsLoading || tasksLoading
  const processedNotes = notes.filter((n: Record<string, unknown>) => n.processed)
  const pendingTasks = tasks.filter((t: Record<string, unknown>) => t.status !== "done")
  const recentNotes = notes.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
              <BrainIcon className="size-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Your knowledge at a glance
              </p>
            </div>
          </div>
        </div>
        <Button render={<Link href="/notes" />} nativeButton={false} className="shadow-md shadow-primary/20">
          <PlusIcon className="mr-2 size-4" />
          New Note
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Notes"
            value={notes.length}
            icon={FileTextIcon}
            href="/notes"
            gradient="from-blue-500 to-indigo-600"
          />
          <StatCard
            title="AI Processed"
            value={processedNotes.length}
            icon={SparklesIcon}
            href="/notes"
            gradient="from-emerald-500 to-teal-600"
          />
          <StatCard
            title="Insights"
            value={insights.length}
            icon={LightbulbIcon}
            href="/insights"
            gradient="from-amber-500 to-orange-600"
          />
          <StatCard
            title="Pending Tasks"
            value={pendingTasks.length}
            icon={ListTodoIcon}
            href="/tasks"
            gradient="from-purple-500 to-violet-600"
          />
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Recent Notes</h2>
            <Button variant="ghost" size="sm" render={<Link href="/notes" />} nativeButton={false} className="text-xs text-muted-foreground">
              View all
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl" />
              ))}
            </div>
          ) : recentNotes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center gap-3 py-12">
                <div className="rounded-2xl bg-muted/50 p-4">
                  <FileTextIcon className="size-8 text-muted-foreground/40" />
                </div>
                <p className="text-sm text-muted-foreground">No notes yet</p>
                <Button variant="outline" size="sm" render={<Link href="/notes" />} nativeButton={false}>
                  <PlusIcon className="mr-1.5 size-3.5" />
                  Create your first note
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {recentNotes.map((note: Record<string, unknown>) => (
                <Card key={note.id as string} className="transition-shadow hover:shadow-sm">
                  <CardContent className="flex items-center gap-3 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium">
                        {(note.title as string) || "Untitled"}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {(note.content as string)?.slice(0, 100) || "No content"}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {(note.processed as boolean) && (
                        <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-300">
                          <SparklesIcon className="mr-1 size-2.5" />
                          processed
                        </Badge>
                      )}
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                        <CalendarIcon className="size-2.5" />
                        {new Date(note.created_at as string).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-sm font-semibold">Quick Actions</h2>
          <div className="grid gap-2">
            <QuickAction
              title="Ask Oracle"
              description="Chat with your AI knowledge assistant"
              icon={MessageCircleIcon}
              href="/chat"
            />
            <QuickAction
              title="Upload Document"
              description="Add files to your knowledge base"
              icon={UploadIcon}
              href="/documents"
            />
            <QuickAction
              title="Search Everything"
              description="Find across all notes and documents"
              icon={LightbulbIcon}
              href="/search"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
