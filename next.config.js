/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit', 'lucide-react', 'framer-motion'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimize bundle splitting
    if (!isServer) {
      config.optimization.splitChunks.chunks = 'all'
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        tiptap: {
          name: 'tiptap',
          test: /[\\/]node_modules[\\/]@tiptap[\\/]/,
          chunks: 'all',
          priority: 30,
        },
        ui: {
          name: 'ui',
          test: /[\\/]node_modules[\\/]@radix-ui[\\/]/,
          chunks: 'all',
          priority: 20,
        }
      }
    }
    
    return config
  },
  images: {
    domains: ['upload.wikimedia.org'],
    formats: ['image/webp', 'image/avif'],
  },
}

module.exports = nextConfig