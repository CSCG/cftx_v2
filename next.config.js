const { execSync } = require('child_process');

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  env: {
    NEXT_PUBLIC_GIT_COMMIT: execSync('git rev-parse --short HEAD').toString().trim(),
  }
};

module.exports = nextConfig;
