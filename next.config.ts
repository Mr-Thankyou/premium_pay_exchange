import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  /*The ones  i added */
  reactStrictMode: true,

  compiler: {
    styledComponents: true,
  },

  typescript: {
    // ❌ Do not stop the build on TS errors
    ignoreBuildErrors: true,
  },

  eslint: {
    // ❌ Do not stop the build on ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
