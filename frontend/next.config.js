/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:1203/api/:path*",
      },
    ];
  },
};
module.exports = nextConfig;
