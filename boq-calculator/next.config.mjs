/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      rules: {
        "*.css": {
          loaders: ["postcss-loader"],
        },
      },
    },
  },
};

export default nextConfig;
