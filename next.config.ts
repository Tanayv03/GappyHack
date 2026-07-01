import type { NextConfig } from "next"

const isDev = process.env.NODE_ENV === "development"

const nextConfig: NextConfig = {
  ...(isDev
    ? {
        async rewrites() {
          return [
            {
              source: "/lemma-api/:path*",
              destination: "https://api.lemma.work/:path*",
            },
          ]
        },
      }
    : {
        output: "export",
      }),
}

export default nextConfig
