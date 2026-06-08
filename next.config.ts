/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rgdqblznjacamtprxwxk.supabase.co",
      },
    ],
  },
};

module.exports = nextConfig;