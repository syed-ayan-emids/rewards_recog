import type { NextConfig } from 'next'
import path from 'node:path'

const nextConfig: NextConfig = {
  // This app owns web/ — don't let Turbopack infer the repo root from the old
  // SPA's package-lock and slow down/watch unrelated files.
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
