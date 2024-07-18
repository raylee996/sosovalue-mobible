import TelegramLoginSelector from "components/telegram/loginSelector";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

export default function TelegramLogin() {
  return <TelegramLoginSelector />;
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
