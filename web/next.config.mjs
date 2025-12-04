/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/git119',
  // assetPrefix'i tam URL olarak vermek, statik hostinglerde (GitHub Pages gibi) 
  // dosya yollarının karışmasını kesin olarak engeller.
  assetPrefix: 'https://emre-mutlu.github.io/git119',
};

export default nextConfig;
