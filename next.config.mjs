import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/features/', destination: '/features', permanent: true },
      { source: '/pricing/', destination: '/pricing', permanent: true },
      { source: '/caepe-test-drive/', destination: '/test-drive', permanent: true },
      { source: '/caepe-test-drive', destination: '/test-drive', permanent: true },
      { source: '/resources/', destination: '/resources', permanent: true },
      { source: '/wp-admin', destination: '/', permanent: true },
      { source: '/wp-admin/:path*', destination: '/', permanent: true },
      { source: '/wp-login.php', destination: '/', permanent: true },
      { source: '/docs/index', destination: '/docs', permanent: true },
      // Out-of-scope pages — redirect to live site during pilot
      { source: '/use-cases', destination: 'https://caepe.sh/use-cases/', permanent: false },
      { source: '/faq', destination: 'https://caepe.sh/faq/', permanent: false },
      { source: '/contact', destination: 'https://caepe.sh/contact/', permanent: false },
      { source: '/end-user-subscription-agreement', destination: 'https://caepe.sh/end-user-subscription-agreement/', permanent: false },
      { source: '/end-user-license-agreement', destination: 'https://caepe.sh/end-user-license-agreement/', permanent: false },
    ]
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
