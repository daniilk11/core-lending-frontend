/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export", // Enables static export
    basePath: "/core-lending-frontend", // Replace with your repo name
    images: { unoptimized: true }, // GitHub Pages does not support Next.js image optimization
};

module.exports = nextConfig;
