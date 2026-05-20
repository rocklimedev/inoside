/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const API_URL = isDev
  ? "http://localhost:5000"
  : "https://buildcon-api.rippotaiarchitecture.com"; // ← Change if needed

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`, // Important: removed extra /api
      },
    ];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              connect-src 'self' 
                ${isDev ? "http://localhost:5000" : "https://buildcon-api.rippotaiarchitecture.com"}
                https://buildcon.rippotaiarchitecture.com;
              script-src 'self' 'unsafe-inline' 'unsafe-eval';
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: https:;
              font-src 'self' data: https:;
              object-src 'none';
              base-uri 'self';
              frame-ancestors 'none';
            `
              .replace(/\s+/g, " ")
              .trim(),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
