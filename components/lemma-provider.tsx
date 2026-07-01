"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setTestingToken } from "lemma-sdk"
import { useState, type ReactNode } from "react"
import { getLemmaClient } from "@/lib/lemma"
import { useAuth } from "lemma-sdk/react"
import { BrainIcon, KeyIcon, LogInIcon, Loader2Icon } from "lucide-react"
import { useEffect } from "react"

function getRedirectUri() {
  if (typeof window === "undefined") return "https://secondbrain.apps.lemma.work/"
  return window.location.hostname === "localhost"
    ? "http://localhost:3000/"
    : "https://secondbrain.apps.lemma.work/"
}

function AuthGate({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth(getLemmaClient())
  const [showTokenInput, setShowTokenInput] = useState(false)
  const [token, setToken] = useState("")

  useEffect(() => {
    // Auto-redirect to Lemma auth if not authenticated and no developer token is present
    const hasTestingToken = typeof window !== "undefined" && !!localStorage.getItem("lemma_testing_token")
    if (!isLoading && !isAuthenticated && !hasTestingToken) {
      getLemmaClient().auth.redirectToAuth({
        redirectUri: getRedirectUri(),
      })
    }
  }, [isLoading, isAuthenticated])

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2Icon className="size-6 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  function handleSignIn() {
    getLemmaClient().auth.redirectToAuth({
      redirectUri: getRedirectUri(),
    })
  }

  function handleTokenSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!token.trim()) return
    setTestingToken(token.trim())
    window.location.reload()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4">
      <div className="w-full max-w-[420px] rounded-3xl border border-gray-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 p-8 shadow-xl dark:shadow-black/50 space-y-6 animate-in fade-in-50 duration-300">
        
        {/* Logo and Header */}
        <div className="text-center space-y-3">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <BrainIcon className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome Back</h1>
            <p className="mt-1.5 text-xs text-muted-foreground font-medium">
              Access your Second Brain AI knowledge engine.
            </p>
          </div>
        </div>

        {/* Auth Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSignIn}
            className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 transition-all active:scale-[0.99]"
          >
            <LogInIcon className="size-4" />
            Sign in with Lemma
          </button>
          
          <button
            onClick={() => setShowTokenInput(!showTokenInput)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-transparent py-3 text-xs font-bold hover:bg-accent transition-all active:scale-[0.99]"
          >
            <KeyIcon className="size-4" />
            Use API Token
          </button>
        </div>

        {showTokenInput && (
          <form onSubmit={handleTokenSubmit} className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="Paste your Lemma token..."
              className="w-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-transparent px-3 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:ring-emerald-500/5 transition-all"
            />
            <button
              type="submit"
              disabled={!token.trim()}
              className="w-full rounded-2xl bg-primary py-2 text-xs font-bold text-primary-foreground disabled:opacity-50 transition-all"
            >
              Connect
            </button>
          </form>
        )}

        <p className="text-center text-[10px] text-muted-foreground/50 font-medium">
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
