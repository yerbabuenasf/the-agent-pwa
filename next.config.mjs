/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enables React strict mode for better development warnings
  reactStrictMode: true,

  // Headers for PWA support
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
};

export default nextConfig;
