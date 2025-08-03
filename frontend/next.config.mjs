import tailwindcss from 'tailwindcss'; // Use ES Module import syntax

/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["picsum.photos", "example.com"],
  },
  
  // Add the plugins array
  plugins: [tailwindcss],
};

export default nextConfig; // Use ES Module export syntax