/** @type {import('next').NextConfig} */
const userConfig = await (async () => {
  try {
    const mod = await import('./v0-user-next.config.mjs')
    return mod.default || {}
  } catch {
    return {}
  }
})()

const nextConfig = {
  //output: 'export',

   basePath: '',
 assetPrefix: '',
  trailingSlash: true, // required for static hosting with sub-path
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // required for export
  },
  experimental: {
    appDir: true, // ensure it's App Router enabled
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  ...userConfig,
}

export default nextConfig
