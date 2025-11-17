import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [768, 1024, 1280],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
}

export default config
