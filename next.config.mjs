/** @type {import('next').NextConfig} */
import path from 'path';

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ensure that all imports of 'yjs' resolve to the same instance
      config.resolve.alias['yjs'] = path.resolve(process.cwd(), 'node_modules/yjs')
    }
    return config
  },
};

export default nextConfig;