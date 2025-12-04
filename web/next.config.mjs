/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages URL: https://emre-mutlu.github.io/git119/
  // Repo Name: git119
  basePath: '/git119',
  // assetPrefix genellikle basePath ile aynıdır, Next.js bunu otomatik halleder ama
  // bazen explicit belirtmek gerekebilir.
  assetPrefix: '/git119',
};

export default nextConfig;