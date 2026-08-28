/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'standalone', // Désactivé - bug avec Next.js 16


  async rewrites() {
    return [
      {
        source: '/api/bot/:path*',
        destination: `${process.env.PYTHON_BACKEND_URL || 'http://127.0.0.1:8000'}/api/v1/:path*`,
      },
      {
        source: "/sondage_:id",
        destination: "/sondage/:id",
      },
    ];
  },
};

export default nextConfig;
