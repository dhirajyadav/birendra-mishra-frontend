import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingIncludes: { '/*': ['./templates/**/*'] },
};

export default nextConfig;
