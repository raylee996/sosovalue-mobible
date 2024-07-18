import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import TelegramLoginGuide from "components/telegram/loginGuide";

export default function TelegramLogin() {
  return <TelegramLoginGuide />;
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common"])),
    },
  };
}
