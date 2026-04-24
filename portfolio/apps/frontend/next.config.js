/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? '/Portfolio_web' : '',
  assetPrefix: isProd ? '/Portfolio_web' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/Portfolio_web' : '',
  },
};

module.exports = nextConfig;
