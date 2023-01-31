/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/user',
        destination: '/user/inbox',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
