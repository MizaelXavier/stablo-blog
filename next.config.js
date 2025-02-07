/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "cdn.sanity.io" }]
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: process.env.VERCEL_ENV === "production"
  },
  eslint: {
    /// Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: process.env.VERCEL_ENV === "production"
  },
  experimental: {
    largePageDataBytes: 128 * 100000
  },
  serverExternalPackages: ['@sanity/client'],
  cacheHandler: require.resolve('./cache-handler.js'),
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { 
            key: 'Cache-Control',
            value: 'public, s-maxage=10, stale-while-revalidate=59'
          }
        ],
      }
    ]
  }
};

module.exports = nextConfig;
