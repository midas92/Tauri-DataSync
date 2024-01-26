/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  env: {
    GOOGLE_CLIENT_ID:
      "",
    GOOGLE_CLIENT_SECRET: "",
    AUTH_SECRET:'',
    lemonkey:
      "",
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  output:'export',
  
};

module.exports = nextConfig;
