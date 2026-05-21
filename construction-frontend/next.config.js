/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV === "development";

const API_URL = isDev
  ? "http://localhost:5000"
  : "https://buildcon-api.rippotaiarchitecture.com";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/:path*`,
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
                ${
                  isDev
                    ? "http://localhost:5000"
                    : "https://buildcon-api.rippotaiarchitecture.com"
                }
                https://buildcon.rippotaiarchitecture.com;

              script-src 'self' 'unsafe-inline' 'unsafe-eval';

              style-src 'self' 'unsafe-inline';

              img-src 'self' data: https: blob:;

              font-src 'self' data: https:;

              frame-src 'self'
                https://docs.google.com
                https://mozilla.github.io
                https://media-buildcon.rippotaiarchitecture.com;

              child-src 'self'
                https://docs.google.com
                https://mozilla.github.io
                https://media-buildcon.rippotaiarchitecture.com;

              object-src 'none';

              base-uri 'self';

              frame-ancestors 'self';
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
