/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/api/:path*", // ← Change port if your NestJS runs on different port
      },
    ];
  },
};

export default nextConfig;
