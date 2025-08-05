/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ["picsum.photos", "example.com","eccomerce-vuc3.onrender.com"],
  },
};

export default nextConfig;
