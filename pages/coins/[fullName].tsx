import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CurrencyDetail, {
  PageType,
} from "components/operation/currency/CurrencyDetail";

const CurrencyDetailPage = () => {
  return <CurrencyDetail pageType={PageType.Coin} />;
};

export default CurrencyDetailPage;

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "common",
        "portfolio",
        "home",
        "research",
      ])),
      // Will be passed to the page component as props
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking", // false or "blocking"
  };
};
