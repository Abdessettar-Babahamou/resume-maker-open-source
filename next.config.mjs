/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "country-state-city-nextjs.vercel.app",
      },
    ],
  },
};

export default nextConfig;
