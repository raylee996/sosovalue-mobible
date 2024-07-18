// @ts-check
const { i18n } = require("./next-i18next.config.js");
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   disable: process.env.NODE_ENV === 'development',
//   register: true,
//   skipWaiting: true
// })

const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
});

// ANALYZE=true npm run build
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const themeVars = require('./scripts/generateCssVars.js')

/** @type {import('next/dist/lib/load-custom-routes').Header[]} */
const nextHeadersOptions = [];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    lightVars: themeVars.light,
    darkVars: themeVars.dark,
  },
  headers: async () => {
    return nextHeadersOptions;
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    config.resolve.fallback = { fs: false, net: false, tls: false };
    // config.module.rules?.push({
    //   test: /old/,
    //   loader: "ignore-loader",
    // });
    return config;
  },
  i18n,
  optimizeFonts: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "web3image.s3.amazonaws.com",
        port: "",
        pathname: "/web3image/**",
      },
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "pbs.twimg.com",
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api-dev/:path*',
  //       destination: 'https://test1.sosponge.xyz/:path*',
  //       basePath: false
  //     },
  //     {
  //       source: '/api-dev-upload/:path*',
  //       destination: 'https://test1.sosponge.xyz/:path*',
  //       basePath: false
  //     },
  //   ]
  // },
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  transpilePackages: ["ahooks"],
};

// ngrok-skip-browser-warning 请求头是为了跳过ngrok的浏览器警告
if (process.env.NODE_ENV === "development") {
  nextConfig.headers = async () => {
    return [...nextHeadersOptions];
  };
}

// @ts-ignore
module.exports = withBundleAnalyzer(withPWA(nextConfig));

// Injected content via Sentry wizard below

const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(
  module.exports,
  {
    // For all available options, see:
    // GitHub - getsentry/sentry-webpack-plugin: Repo moved to https://github.com/getsentry/sentry-javascri

    // Suppresses source map uploading logs during build
    silent: true,
    org: "sosovalue",
    project: "sosovalue-mobile",
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers (increases server load)
    tunnelRoute: "/monitoring",

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
