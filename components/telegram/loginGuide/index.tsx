import NavigateWrap from "components/layout/NavigateWrap";
import Image from "next/image";
import Button from "@mui/material/Button";
import Link from "next/link";
import GuideCard from "./GuideCard";
import { telegramHelper } from "helper/telegram";

const TelegramLoginGuide: React.FC = () => {
  const handleJump = () => telegramHelper.openBrowser("/setting");

  return (
    <NavigateWrap lessNavigateHeight>
      <div className="py-5 px-10 text-white space-y-4">
        <GuideCard
          title={"Link Telegram Account"}
          content={
            "Please visit the SoSoValue web page to link your Telegram account, allowing you to log in with the same account in this app."
          }
        />
        <GuideCard
          title={"Step 1"}
          content={
            "Open and login your SoSoValue website or mobile app and navigate to settings."
          }
          banner={
            <Image
              src="/img/telegram/banner-login-guide1.png"
              width={310}
              height={120}
              alt=""
            />
          }
        />
        <GuideCard
          title={"Step 2"}
          content={"Connect your Telegram account."}
          banner={
            <Image
              src="/img/telegram/banner-login-guide2.png"
              width={310}
              height={120}
              alt=""
            />
          }
        />

        <Button
          variant="contained"
          size="large"
          fullWidth
          className="h-12 rounded-lg"
          onClick={handleJump}
        >
          Got it! Jump to SoSoValue
        </Button>
      </div>
    </NavigateWrap>
  );
};

export default TelegramLoginGuide;
