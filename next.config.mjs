import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // eslint: {  ← À SUPPRIMER complètement
  //   ignoreDuringBuilds: true,
  // },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: []
  },
}

export default withNextIntl(nextConfig)