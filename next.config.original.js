/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'
const repoName = 'researcher-console' // Replace with your GitHub repo name

const nextConfig = {
  // Enable static exports for GitHub Pages
  output: 'export',
  
  // Add basePath for GitHub Pages (e.g., /repo-name)
  basePath: isProd ? `/${repoName}` : '',
  
  // Add assetPrefix for proper asset loading
  assetPrefix: isProd ? `/${repoName}/` : '',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  
  // Keep existing optimizations
  experimental: {
    optimizePackageImports: ['@tiptap/react', '@tiptap/starter-kit', 'lucide-react', 'framer-motion'],
  },
  
  // Trailing slashes for GitHub Pages
  trailingSlash: true,
  
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
}

module.exports = nextConfig