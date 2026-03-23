/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@cam-ui/components"],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
