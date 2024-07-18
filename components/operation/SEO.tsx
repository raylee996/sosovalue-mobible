import { getOrigin } from "helper/config";
import Head from "next/head";

type SEOConfig = {
  schema?: string;
  title?: string;
  twitterTitle?: string;
  telegramTitle?: string;
  description?: string;
  image?: string;
};

type Props = {
  config?: SEOConfig;
};

const title =
  "Cryptocurrency Prices, Charts, ETFs and Crypto Market Cap | SoSoValue";

const description =
  "Free access to cryptocurrency trading data, featuring real-time prices, volumes, charts for Bitcoin, Ethereum, Solana, etc. Dive into the latest news & updates, prominent sectors, in-depth research reports, and trending topics within Web 3.0. Uncover the top performers, spotlighted tokens, and their underlying value.";

const defaultSeo: Required<SEOConfig> = {
  schema: `
              {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "SoSoValue",
  "alternateName": ["sosovalue", "SoSoValue", "Sosovalue", "SoSoValue", "SoSovalue", "Bitcoin ETF Analysis", "ETF Investment Dashboard", "Crypto ETF Platform", "ETF", "Bitcoin ETF", "Bitcoin ETF Dashboard", "ETF Dashboard", "Free ETF Dashboard", "Free Dashboard"],
  "description": "Free access to cryptocurrency trading data, featuring real-time prices, volumes, charts for Bitcoin, Ethereum, Solana, etc. Dive into the latest news & updates, prominent sectors, in-depth research reports, and trending topics within Web 3.0. Uncover the top performers, spotlighted tokens, and their underlying value.",
  "url": "https://alpha.sosovalue.xyz"
}
            `,
  title,
  twitterTitle: title,
  telegramTitle: title,
  description,
  image: `${getOrigin()}/img/seo.png`,
};

const createSeoConfig = (props: Props) => {
  return Object.keys(defaultSeo).reduce<SEOConfig>((config, key) => {
    const k = key as keyof SEOConfig;
    config[k] = props.config?.[k] || defaultSeo[k];
    return config;
  }, {}) as Required<SEOConfig>;
};

const SEO = (props: Props) => {
  const config = createSeoConfig(props);
  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: config.schema,
        }}
      ></script>
      <title>{config.title}</title>
      <meta name="description" content={config.description} />
      <meta
        name="framer-search-index"
        content="https://framerusercontent.com/sites/7Mg39zJoFDekMcLOsdYf4b/searchIndex-nWaUmRHBVZhs.json"
      />
      <link rel="icon" href="/img/logo.jpeg" />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={config.telegramTitle} />
      <meta property="og:description" content={config.description} />
      <meta property="og:image" content={config.image} />
      <meta property="og:site_name" content="SoSoValue" />
      <meta property="og:url" content="https://sosovalue.xyz" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://sosovalue.xyz" />
      <meta name="twitter:site" content="@SoSoValueCrypto" />
      <meta name="twitter:title" content={config.twitterTitle} />
      <meta name="twitter:description" content={config.description} />
      <meta name="twitter:image" content={config.image} />
      <meta name="twitter:image:src" content={config.image} />
      <link rel="canonical" href="https://sosovalue.xyz/" />
      <link rel="alternate" hrefLang="en" href="https://sosovalue.xyz/" />
      <link rel="alternate" hrefLang="zh" href="https://sosovalue.xyz/zh/" />
      <link rel="alternate" hrefLang="tc" href="https://sosovalue.xyz/tc/" />
      <link rel="alternate" hrefLang="ja" href="https://sosovalue.xyz/ja/" />
    </Head>
  );
};

export default SEO;
