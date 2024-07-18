import { setAddress } from "helper/storage";
import { isBrowser } from "helper/tools";
import React, { PropsWithChildren, useContext } from "react";
import { UserContext, message } from "store/UserStore";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";

const SafePalWalletWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const { signWalletMessage } = useContext(UserContext);
  const { connect } = useConnect();
  const { address } = useAccount();
  function getProvider() {
    return isBrowser ? window.safepalProvider : null;
  }
  const onClick = async () => {
    // if (!getProvider()) {
    //   return error("SafePal Wallet is not installed");
    // }
    // const SafePalProvider = getProvider();
    // if (address) {
    //   return await SafePalProvider?.request({
    //     method: "personal_sign",
    //     params: [address, message],
    //   });
    // }
    // const accounts = await SafePalProvider?.request({
    //   method: "eth_requestAccounts",
    // });
    // return await SafePalProvider?.request({
    //   method: "personal_sign",
    //   params: [accounts[0], message],
    // });
    if (!address) {
      connect({ connector: injected() });
    } else {
      signWalletMessage();
      // signMessage(
      //   { message },
      //   {
      //     onSuccess() {
      //       setAddress(address as string);
      //     },
      //   }
      // );
    }
  };
  const renderChildren = () => {
    return React.cloneElement(children as React.ReactElement, {
      onClick,
    });
  };

  return <React.Fragment>{renderChildren()}</React.Fragment>;
};

export default SafePalWalletWrapper;
