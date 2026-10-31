/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Christ Hub and Campus Map are switched off for now (see app/_hidden);
      // send old links to the Daksh landing page instead of a 404.
      { source: "/christ-hub", destination: "/", permanent: false },
      { source: "/campus-map", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
