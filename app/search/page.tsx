"use client"

import { useState } from "react"
import { useSearch } from "@/hooks/use-lemma"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchIcon, Loader2Icon, GlobeIcon } from "lucide-react"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [hasSearched, setHasSearched] = useState(false)
  const { search, results, isLoading } = useSearch()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setHasSearched(true)
    search({ query })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Search</h1>
        <p className="text-sm text-muted-foreground">
          Search across all notes, documents, and knowledge.
        </p>
      </div>
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search everything..."
            className="pl-9"
          />
        </div>
        <Button type="submit" disabled={isLoading} className="shadow-md shadow-primary/20">
          {isLoading ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {results && results.length > 0 && (
        <div className="space-y-2">
          {results.map((result, i) => (
            <Card key={i} className="transition-shadow hover:shadow-md">
              <CardContent className="py-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {result.title ?? "Result"}
                    </p>
                    {result.subtitle && (
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {result.subtitle}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {result.kind}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {hasSearched && !isLoading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <div className="rounded-2xl bg-muted/50 p-6">
            <GlobeIcon className="size-10 text-muted-foreground/40" />
          </div>
          <div className="text-center">
            <p className="font-medium text-muted-foreground">No results found</p>
            <p className="mt-1 text-sm text-muted-foreground/60">
              Try different keywords or upload documents to build your knowledge base.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
