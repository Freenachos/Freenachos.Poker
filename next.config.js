/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // All images are self-hosted under /public — no remote image domains allowed.
  async redirects() {
    return [
      // The CMS moved to /admin/articles; old public /articles links land on the archive.
      { source: '/articles', destination: '/newsletters', permanent: true },
      { source: '/articles/:slug', destination: '/newsletters/:slug', permanent: true },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
