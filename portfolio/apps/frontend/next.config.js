const path = require('path');

/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// Set basePath for custom domain (abdull1h.qzz.io is a root domain, so basePath is empty)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const workspaceModules = path.resolve(__dirname, '..', '..', 'node_modules');
const localModules     = path.resolve(__dirname, 'node_modules');

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  
  basePath: basePath, 
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  webpack(config) {
    // Pin all three.js packages to consistent locations
    config.resolve.alias = {
      ...config.resolve.alias,
      'three':              path.resolve(workspaceModules, 'three'),
      '@react-three/fiber': path.resolve(localModules,     '@react-three/fiber'),
      '@react-three/drei':  path.resolve(localModules,     '@react-three/drei'),
    };
    // react-pdf requires canvas for SSR — we don't use SSR, stub it out
    config.resolve.alias['canvas'] = false;
    // Suppress monorepo vendor-chunk cache warnings (harmless noise)
    config.infrastructureLogging = { level: 'error' };
    return config;
  },
};

module.exports = nextConfig;
