/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === "development";

const API_URL = isDev
  ? "http://localhost:5000"
  : "https://inoside.onrender.com";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
