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
