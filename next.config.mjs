/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Christ Hub is now the landing page; keep old /christ-hub links working.
      { source: "/christ-hub", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
