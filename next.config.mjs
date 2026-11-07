/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // site estático para o GitHub Pages
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
