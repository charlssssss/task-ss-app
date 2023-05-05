/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/user',
        destination: '/user/dashboard',
        permanent: true,
      },
      {
        source: '/admin',
        destination: '/admin/useraccounts',
        permanent: true,
      },
    ]
  },
  env: {
    NEXTAUTH_SECRET: 'tasksssecret'
  },
}

module.exports = nextConfig
