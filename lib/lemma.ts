"use client"

import { LemmaClient } from "lemma-sdk"

let client: LemmaClient | null = null

export function getLemmaClient(): LemmaClient {
  if (client) return client

  client = new LemmaClient({
    apiUrl: process.env.NEXT_PUBLIC_LEMMA_API_URL!,
    authUrl: process.env.NEXT_PUBLIC_LEMMA_AUTH_URL!,
    podId: process.env.NEXT_PUBLIC_LEMMA_POD_ID!,
  })

  return client
}
