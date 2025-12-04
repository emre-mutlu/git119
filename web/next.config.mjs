/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages genellikle bir alt dizinde çalışır (örn: emre-mutlu.github.io/git119/)
  // Bu yüzden basePath ayarlamamız gerekebilir.
  // Ancak bu ayar sadece production build sırasında (GitHub Actions) geçerli olmalı.
  basePath: isProd ? '/git119' : '',
  assetPrefix: isProd ? '/git119' : '',
};

export default nextConfig;
