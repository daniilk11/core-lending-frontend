/** @type {import('next').NextConfig} */

const nextConfig = {
    output: 'export',
    images: {
        unoptimized: true,
    },
    basePath: process.env.NODE_ENV === 'production' ? '/core-lending-frontend' : '',
    assetPrefix: process.env.NODE_ENV === 'production' ? '/core-lending-frontend/' : '',
}

module.exports = nextConfig