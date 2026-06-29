"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setTestingToken, getTestingToken } from "lemma-sdk"
import { useState, useEffect, type ReactNode } from "react"
import { getLemmaClient } from "@/lib/lemma"
import { useAuth } from "lemma-sdk/react"

function AuthBanner() {
  const { isAuthenticated } = useAuth(getLemmaClient())
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [token, setToken] = useState("")

  if (isAuthenticated) return null

  function handleSignIn() {
    const client = getLemmaClient()
    client.auth.redirectToAuth({
      redirectUri: window.location.href,
    })
  }

  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token.trim()) return
    setTestingToken(token.trim())
    window.location.reload()
  }

  return (
    <div className="border-b border-yellow-500/30 bg-yellow-500/10 px-4 py-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-yellow-700 dark:text-yellow-300">
          Not connected to Lemma — data features require authentication.
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSignIn}
            className="rounded-md bg-foreground px-3 py-1 text-xs font-medium text-background hover:bg-foreground/90"
          >
            Sign In
          </button>
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-accent"
          >
            Use Token
          </button>
        </div>
      </div>
      {showTokenInput && (
        <form onSubmit={handleTokenSubmit} className="mt-2 flex gap-2">
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste Lemma token..."
            className="flex-1 rounded-md border bg-transparent px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={!token.trim()}
            className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground disabled:opacity-50"
          >
            Connect
          </button>
        </form>
      )}
    </div>
  )
}

export { AuthBanner }

export function LemmaProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
