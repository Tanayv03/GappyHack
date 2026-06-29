import { NextResponse } from "next/server"
import { readFileSync } from "fs"
import { join } from "path"

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "dev only" }, { status: 403 })
  }
  try {
    const token = readFileSync(
      join(process.env.LOCALAPPDATA || "", "Temp", "claude", "lemma_token.txt"),
      "utf-8"
    ).trim()
    return NextResponse.json({ token })
  } catch {
    return NextResponse.json({ error: "no token file" }, { status: 404 })
  }
}
