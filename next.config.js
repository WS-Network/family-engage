/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: '**', // Replace with your image host domain
        },
      ],
    },
    // Other configurations can go here
  };
  
  module.exports = nextConfig;
  