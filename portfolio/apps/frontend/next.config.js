/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  // GitHub Pages serves from /Portfolio_web/ sub-path
  basePath: isProd ? '/Portfolio_web' : '',
  assetPrefix: isProd ? '/Portfolio_web/' : '',
};

module.exports = nextConfig;
