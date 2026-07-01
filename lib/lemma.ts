"use client"

import { LemmaClient } from "lemma-sdk"

let client: LemmaClient | null = null

export function getLemmaClient(): LemmaClient {
  if (client) return client

  // Dynamically use proxy rewrite on localhost to bypass CORS restrictions
  let apiUrl = process.env.NEXT_PUBLIC_LEMMA_API_URL!
  if (typeof window !== "undefined" && window.location.hostname === "localhost") {
    apiUrl = "/lemma-api"
  }

  console.log("INITIALIZING LEMMA CLIENT WITH CONFIG:", {
    apiUrl,
    authUrl: process.env.NEXT_PUBLIC_LEMMA_AUTH_URL!,
    podId: process.env.NEXT_PUBLIC_LEMMA_POD_ID!,
  })

  client = new LemmaClient({
    apiUrl,
    authUrl: process.env.NEXT_PUBLIC_LEMMA_AUTH_URL!,
    podId: process.env.NEXT_PUBLIC_LEMMA_POD_ID!,
  })

  return client
}
