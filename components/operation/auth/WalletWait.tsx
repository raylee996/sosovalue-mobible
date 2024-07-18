import { Dialog, Slide } from "@mui/material";
import { forwardRef, useContext, useState } from "react";
import { UserContext } from "store/UserStore";
import { TransitionProps } from "@mui/material/transitions";
import { useTranslation } from "next-i18next";
import { localeType } from "store/ThemeStore";
import ScaleLoader from "components/base/ScaleLoader";
import { useRouter } from "next/router";

export enum Language {
  EN = "en",
  ZH = "zh",
  TC = "tc",
  JA = "ja",
}

export const LangMap: Record<string, Record<string, string>> = {
  [Language.EN]: {
    "wait text1": "Authenticating...",
    "wait text2": "Please wait while we authenticate your account.",
    "wait text3": "If the process takes longer than expected, you can click '",
    "wait text31": "Cancel Authentication",
    "wait text32": "' to stop and return to the previous screen.",
  },
  [Language.ZH]: {
    "wait text1": "验证中...",
    "wait text2": "请稍候，我们正在验证您的账户。",
    "wait text3": "如果此过程花费的时间比预期的要长，您可以点击“",
    "wait text31": "取消验证",
    "wait text32": "”以停止并返回到上一个屏幕。",
  },
  [Language.TC]: {
    "wait text1": "驗證中...",
    "wait text2": "請稍候，我們正在驗證您的帳戶。",
    "wait text3": "如果此過程花費的時間比預期的要長，您可以點擊“",
    "wait text31": "取消驗證",
    "wait text32": "”以停止並返回上一個畫面。",
  },
  [Language.JA]: {
    "wait text1": "確認中...",
    "wait text2": "しばらくお待ちください。アカウントを確認しています。",
    "wait text3": "このプロセスに予想以上の時間がかかる場合、",
    "wait text31": "確認をキャンセル",
    "wait text32": "停止して前の画面に戻る。",
  },
};
type Props = {
  isConnecting: boolean;
};
const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const Auth = ({ isConnecting }: Props) => {
  const router = useRouter();
  const { authModal } = useContext(UserContext);
  const [show, setShow] = useState(isConnecting);
  const { t } = useTranslation([localeType.COMMON]);
  return (
    <div>
      <Dialog
        fullScreen
        open={show}
        TransitionComponent={Transition}
        className="z-[1501]"
        classes={{ paper: "bg-dropdown-White-800 relative touch-none bg-none" }}
      >
        <div className="w-full px-8">
          {/* <Image
            src="/img/sosovalue.png"
            className="mt-2 mb-8"
            width={190}
            height={32}
            alt=""
          /> */}
          <div className="text-primary-900-White flex items-center mt-8">
            <ScaleLoader />
          </div>
          <div className="text-primary-900-White text-xs">
            <div className="my-4 text-base font-bold">
              {LangMap[router.locale as string]["wait text1"]}
            </div>
            <div className="my-4">
              {LangMap[router.locale as string]["wait text2"]}
            </div>
            <div>
              {LangMap[router.locale as string]["wait text3"]}
              <span
                className="text-info underline cursor-pointer"
                onClick={() => {
                  setShow(false);
                }}
              >
                {LangMap[router.locale as string]["wait text31"]}
              </span>
              {LangMap[router.locale as string]["wait text32"]}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Auth;
