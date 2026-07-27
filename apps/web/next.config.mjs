/** @type {import('next').NextConfig} */
const nextConfig = {
  // Monorepo-aware transpile so the workspace packages compile through Next's
  // SWC pipeline instead of being treated as pre-built libraries.
  transpilePackages: ['@thali/shared', '@thali/ui-tokens'],
  reactStrictMode: true,
};

export default nextConfig;
