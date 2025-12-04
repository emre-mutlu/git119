/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages genellikle bir alt dizinde çalışır (örn: emre-mutlu.github.io/git119/)
  // Bu yüzden basePath ayarlamamız gerekebilir.
  // Bu değer GitHub deponuzun adıyla eşleşmelidir.
  basePath: '/git119',
  assetPrefix: '/git119',
};

export default nextConfig;