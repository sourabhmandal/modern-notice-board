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
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'aitplacement-dev.s3.us-east-1.amazonaws.com', // Your S3 bucket's hostname
        port: '',
        pathname: '**', // Allow all paths from this domain
      },
    ],
  },
};

export default nextConfig;