"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setTestingToken } from "lemma-sdk"
import { useState, type ReactNode } from "react"
import { getLemmaClient } from "@/lib/lemma"
import { useAuth } from "lemma-sdk/react"
import { BrainIcon, Loader2Icon, MailIcon, LockIcon, LogInIcon } from "lucide-react"
import { useEffect } from "react"

function AuthGate({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  useEffect(() => {
    const loggedIn = localStorage.getItem("second_brain_logged_in") === "true"
    setIsAuthenticated(loggedIn)
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2Icon className="size-6 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) return
    setIsSubmitting(true)

    // Simulate authenticating...
    setTimeout(() => {
      setIsSubmitting(false)
      localStorage.setItem("second_brain_logged_in", "true")
      localStorage.setItem("second_brain_user_email", email.trim())
      setIsAuthenticated(true)
    }, 1200)
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

        {/* Login Form */}
        <form onSubmit={handleSignIn} className="space-y-4">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Email Address
            </label>
            <div className="relative flex items-center">
              <MailIcon className="absolute left-3.5 size-4 text-muted-foreground/60" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-transparent py-2.5 pl-10 pr-4 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:ring-emerald-500/5 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                Password
              </label>
              <a href="#" className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <LockIcon className="absolute left-3.5 size-4 text-muted-foreground/60" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-2xl border border-gray-200 dark:border-zinc-800 bg-transparent py-2.5 pl-10 pr-4 text-xs shadow-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 dark:focus:ring-emerald-500/5 transition-all"
              />
            </div>
          </div>

          {/* Remember me checkbox */}
          <div className="flex items-center gap-2 py-1">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="size-3.5 rounded-sm border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-800 dark:bg-zinc-950"
            />
            <label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer select-none">
              Remember this device
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !email.trim() || !password.trim()}
            className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/10 hover:shadow-lg hover:shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]"
          >
            {isSubmitting ? (
              <Loader2Icon className="size-4 animate-spin" />
            ) : (
              <>
                <LogInIcon className="size-4" />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-muted-foreground/50 font-medium">
          Protected by local security &copy; {new Date().getFullYear()} Second Brain
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
