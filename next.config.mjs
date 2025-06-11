/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Remove the deprecated appDir option - it's now default in Next.js 15
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['localhost', 'kleverfarms.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
}

export default nextConfig
