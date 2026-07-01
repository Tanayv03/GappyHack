"use client"

import { useState, useEffect, ReactNode } from "react"
import { BrainIcon, Loader2Icon, MailIcon, LockIcon, ArrowRightIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export function AppAuthGate({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loggedIn = localStorage.getItem("second_brain_logged_in") === "true"
    setIsAuthenticated(loggedIn)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in all fields")
      return
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address")
      return
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    // Simulate network authentication
    setTimeout(() => {
      localStorage.setItem("second_brain_logged_in", "true")
      localStorage.setItem("second_brain_user_email", email.trim())
      setIsAuthenticated(true)
      setIsLoading(false)
      toast.success("Welcome to your Second Brain!")
    }, 1200)
  }

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2Icon className="size-6 animate-spin text-emerald-500" />
      </div>
    )
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-zinc-950 overflow-hidden font-sans">
      {/* Dynamic Background Glows */}
      <div className="absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-emerald-500/10 blur-[128px]" />
      <div className="absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-blue-500/10 blur-[128px]" />

      <div className="w-full max-w-[420px] px-4 z-10">
        <Card className="rounded-3xl border border-zinc-800/80 bg-zinc-900/40 backdrop-blur-xl shadow-2xl text-white">
          <CardHeader className="space-y-3 pb-6 pt-8 text-center">
            <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20 shadow-inner">
              <BrainIcon className="size-6 animate-pulse" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold tracking-tight text-zinc-100">Welcome Back</CardTitle>
              <CardDescription className="text-sm text-zinc-400">
                Sign in to access your notes, insights, and AI Second Brain.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pb-8">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-login" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                  Email Address
                </Label>
                <div className="relative">
                  <MailIcon className="absolute left-3.5 top-3 size-4 text-zinc-500" />
                  <Input
                    id="email-login"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-10 rounded-xl bg-zinc-950/50 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password-login" className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <LockIcon className="absolute left-3.5 top-3 size-4 text-zinc-500" />
                  <Input
                    id="password-login"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    className="pl-10 h-10 rounded-xl bg-zinc-950/50 border-zinc-800 text-zinc-200 placeholder-zinc-600 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 mt-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRightIcon className="size-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <span className="text-[11px] text-zinc-500">
                Secure authentication powered by Second Brain App.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
