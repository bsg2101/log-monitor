// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // Statik export için
    images: {
      unoptimized: true, // Statik export için gerekli
    },
}

module.exports = nextConfig
