import * as React from "react";
import Document, { Html, Head, Main, NextScript } from "next/document";
import createEmotionServer from "@emotion/server/create-instance";
import createEmotionCache from "helper/createEmotionCache";

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" translate="no" className="dark">
        <Head>
          {/* Google Tag Manager */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-KH82XD69');`,
            }}
          ></script>
          {/* End Google Tag Manager */}
          {/* PWA primary color */}
          {/* <meta name="theme-color" content={theme.palette.primary.main} /> */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "SoSoValue",
                "alternateName": ["sosovalue", "SoSoValue", "Sosovalue", "SoSoValue", "SoSovalue"],
                "url": "https://sosovalue.xyz",
                "description": "SoSoValue is a one-stop financial research platform for Crypto Investors, offering the most efficient crypto investment tool to predict value trends."
              }
            `,
            }}
          ></script>
          <meta
            name="description"
            content="One-stop financial research platform for crypto investors. We provide up-to-date information about crypto and macro finance, ensure the authenticity of every piece of information on each project. Offering you the most efficient investment research tool."
          />
          <meta
            name="framer-search-index"
            content="https://framerusercontent.com/sites/7Mg39zJoFDekMcLOsdYf4b/searchIndex-nWaUmRHBVZhs.json"
          />
          <link rel="icon" href="/img/logo.jpeg" />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="SoSoValue - See the Unseen, Predict Value"
          />
          <meta
            property="og:description"
            content="One-stop financial research platform for crypto investors. We provide up-to-date information about crypto and macro finance, ensure the authenticity of every piece of information on each project. Offering you the most efficient investment research tool."
          />
          <meta
            property="og:image"
            content="https://framerusercontent.com/images/h69jqs8QQ9a4EA8Ta5RLVepn8.png"
          />
          <meta property="og:site_name" content="SoSoValue" />
          <meta property="og:url" content="https://sosovalue.xyz" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://sosovalue.xyz" />
          <meta
            name="twitter:title"
            content="SoSoValue - See the Unseen, Predict Value"
          />
          <meta
            name="twitter:description"
            content="One-stop financial research platform for crypto investors. We provide up-to-date information about crypto and macro finance, ensure the authenticity of every piece of information on each project. Offering you the most efficient investment research tool."
          />
          <meta
            name="twitter:image"
            content="https://framerusercontent.com/images/h69jqs8QQ9a4EA8Ta5RLVepn8.png"
          />
          <link rel="canonical" href="https://sosovalue.xyz/" />
          <meta property="og:url" content="https://sosovalue.xyz/" />

          <meta name="theme-color" content="#0D0D0D" />
          <meta name="application-name" content="SoSoValue" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="SoSoValue" />
          <meta name="format-detection" content="telephone=no" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="msapplication-config"
            content="/icons/browserconfig.xml"
          />
          <meta name="msapplication-TileColor" content="#0D0D0D" />
          <meta name="msapplication-tap-highlight" content="no" />
          <meta name="theme-color" content="#0D0D0D" />

          <link rel="apple-touch-icon" href="/img/manifest/192x192.png" />
          <link
            rel="apple-touch-icon"
            sizes="192x192"
            href="/img/manifest/192x192.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="384x384"
            href="/img/manifest/384x384.png"
          />
          <link
            rel="apple-touch-icon"
            sizes="512x512"
            href="/img/manifest/512x512.png"
          />

          <link rel="icon" type="image/svg" href="/img/logo.svg" />
          <link
            rel="icon"
            type="image/png"
            sizes="192x192"
            href="/img/manifest/192x192.png"
          />
          <link rel="manifest" href="/manifest.json" />
          <link
            rel="mask-icon"
            href="/icons/safari-pinned-tab.svg"
            color="#5bbad5"
          />
          <link rel="shortcut icon" href="/img/logo.jpeg" />

          <meta name="emotion-insertion-point" content="" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (() => {
                  try {
                    const themeCfg = localStorage.getItem('theme-storage');
                    if (themeCfg) {
                      const { theme } = JSON.parse(themeCfg).state;
                      if (theme === "light") {
                        document.documentElement.classList.remove("dark");
                      }
                    }
                  } catch (error) {}
                })();
              `,
            }}
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                :root {
                  ${process.env.lightVars}
                }
                .dark {
                  ${process.env.darkVars}
                }
              `,
            }}
          />
          {(this.props as any).emotionStyleTags}
          {/* Adobe Fonts Link */}
          <link rel="stylesheet" href="https://use.typekit.net/ocl2afg.css"></link>
        </Head>
        <body
          style={{
            backgroundColor: "var(--background-primary-White-900)",
            color: "var(--primary-900-White)",
          }}
        >
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KH82XD69"
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same Emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App: any) =>
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  // This is important. It prevents Emotion to render invalid HTML.
  // See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return {
    ...initialProps,
    emotionStyleTags,
  };
};
