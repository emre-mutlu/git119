/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages genellikle bir alt dizinde çalışır (örn: emremutlu.github.io/git119/)
  // Bu yüzden basePath ayarlamamız gerekebilir.
  // Ancak özel domain kullanacaksanız buna gerek yok.
  // Şimdilik repo adını basePath olarak ekliyorum, gerekirse kaldırabilirsiniz.
  basePath: '/git119',
  assetPrefix: '/git119',
};

export default nextConfig;
