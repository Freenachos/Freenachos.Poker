/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // All images are self-hosted under /public — no remote image domains allowed.
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
