"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { setTestingToken } from "lemma-sdk"
import { useState, type ReactNode } from "react"
import { getLemmaClient } from "@/lib/lemma"
import { useAuth } from "lemma-sdk/react"
import { BrainIcon, KeyIcon, LogInIcon, Loader2Icon } from "lucide-react"

function AuthGate({ children }: { children: ReactNode }) {
  return <>{children}</>
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
