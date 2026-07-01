"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setTestingToken } from "lemma-sdk"
import { useState, type ReactNode } from "react"
import { getLemmaClient } from "@/lib/lemma"
import { useAuth } from "lemma-sdk/react"
import { BrainIcon, KeyIcon, LogInIcon, Loader2Icon } from "lucide-react"

function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth(getLemmaClient())
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [token, setToken] = useState("")

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2Icon className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (isAuthenticated) return <>{children}</>

  function handleSignIn() {
    getLemmaClient().auth.redirectToAuth({
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
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="mx-4 w-full max-w-sm space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <BrainIcon className="size-7 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Second Brain</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to access your AI-powered knowledge engine.
          </p>
        </div>
        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
          >
            <LogInIcon className="size-4" />
            Sign in with Lemma
          </button>
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium hover:bg-accent transition-colors"
          >
            <KeyIcon className="size-4" />
            Use API Token
          </button>
        </div>
        {showTokenInput && (
          <form onSubmit={handleTokenSubmit} className="space-y-2">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your Lemma token..."
              className="w-full rounded-xl border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={!token.trim()}
              className="w-full rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              Connect
            </button>
          </form>
        )}
        <p className="text-xs text-muted-foreground/60">
          Powered by Lemma
        </p>
      </div>
    </div>
  )
}

export { AuthGate }

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
