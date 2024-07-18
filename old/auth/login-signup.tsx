import { Grow, Dialog, Divider, Button, ListItemButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useContext, useState } from "react";
import SignUp from "components/operation/auth/SignUp";
import Login from "components/operation/auth/Login";
import Waitlist from "components/operation/auth/Waitlist";
import { UserContext } from "store/UserStore";
import useDimensionDict from "hooks/operation/useDimensionDict";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAutoAnimate } from "@formkit/auto-animate/react";

const LoginSignUp = () => {
  const { advertisementConfig } = useDimensionDict({ withAll: false });
  const { isAllowRegister, authModal, googleLogin, twitterLoginRedirect } =
    useContext(UserContext);
  const [unRegisterEmail, setUnRegisterEmail] = useState("");
  const [parent] = useAutoAnimate();
  const [gurandfather] = useAutoAnimate();
  return (
    <div className="h-[576px]" ref={gurandfather}>
      <div className="mb-8">
        <Button
          onClick={() => authModal?.openLoginTab()}
          className={`normal-case text-2xl  ${
            authModal?.showLoginTab
              ? "text-primary font-bold"
              : "text-sub-title font-normal"
          } mr-8 -ml-2`}
        >
          Log In
        </Button>
        <Button
          onClick={() => authModal?.openSignUpTab()}
          className={`normal-case text-2xl ${
            authModal?.showSignUpTab
              ? "text-primary font-bold"
              : "text-sub-title font-normal"
          }`}
        >
          Sign Up
        </Button>
      </div>
      <div ref={parent}>
        {authModal?.showSignUpTab ? (
          <SignUp unRegisterEmail={unRegisterEmail} />
        ) : (
          <Login setUnRegisterEmail={(email) => setUnRegisterEmail(email)} />
        )}
        <div className="text-content text-sm flex items-center justify-between w-full my-8">
          <i className="flex-1 h-[1px] bg-[#242424]"></i>
          <span className="mx-4">or</span>
          <i className="flex-1 h-[1px] bg-[#242424]"></i>
        </div>
        <div className="flex gap-4 h-[74px]">
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              return (
                <ListItemButton
                  onClick={openConnectModal}
                  className="text-sub-title text-base flex-col h-full rounded border border-solid border-[#404040] hover:bg-primary hover:border-primary hover:text-title"
                >
                  <Image
                    className="mb-2"
                    src="/img/svg/Wallet.svg"
                    width={24}
                    height={24}
                    alt=""
                  />
                  <span>Wallet</span>
                </ListItemButton>
              );
            }}
          </ConnectButton.Custom>

          <ListItemButton
            onClick={googleLogin}
            className="text-sub-title text-base flex-col h-full rounded border border-solid border-[#404040] hover:bg-primary hover:border-primary hover:text-title"
          >
            <Image
              className="mb-2"
              src="/img/svg/google-bold.svg"
              width={24}
              height={24}
              alt=""
            />
            <span>Google</span>
          </ListItemButton>
          <ListItemButton
            onClick={twitterLoginRedirect}
            className="text-sub-title text-base flex-col h-full rounded border border-solid border-[#404040] hover:bg-primary hover:border-primary hover:text-title"
          >
            <Image
              className="mb-2"
              src="/img/svg/twitter-new.svg"
              width={24}
              height={24}
              alt=""
            />
            <span>Twitter</span>
          </ListItemButton>
        </div>
        <div className="mt-8 text-xs text-content">
          By signing up,you agree to our{" "}
          <Link
            className="underline"
            href="https://sosovalue.xyz/blog/terms-of-service"
            target="_blank"
          >
            Terms
          </Link>{" "}
          and{" "}
          <Link
            className="underline"
            href="https://sosovalue.xyz/blog/privacy-policy"
            target="_blank"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginSignUp;
