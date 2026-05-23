import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                pathname: '/avatars/**',
            },
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
        ],
    },
};

module.exports = {
    allowedDevOrigins: ['192.168.56.1'],
}

export default nextConfig;
