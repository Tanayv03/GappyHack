import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/lemma-api/:path*",
        destination: "https://api.lemma.work/:path*",
      },
    ]
  },
}

export default nextConfig
