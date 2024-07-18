import "@rainbow-me/rainbowkit/styles.css";

import {
  getDefaultConfig,
  RainbowKitProvider,
  lightTheme,
  darkTheme,
  Locale,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import {
  rainbowWallet,
  metaMaskWallet,
  coinbaseWallet,
  walletConnectWallet,
  safepalWallet,
  injectedWallet,
  safeWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { useThemeStore } from "./useThemeStore";
import { getAddress } from "helper/storage";
import { isBrowser } from "helper/tools";
// import safePalWallet from "./safePalWallet";

const _customSafepalWallet: typeof safepalWallet = (props) => {
  const res = safepalWallet(props);
  res.installed = res.installed || undefined;
  res.iconBackground = "transparent";
  return res;
};

const connectors = connectorsForWallets(
  [
    {
      groupName: "Popular",
      wallets: [
        _customSafepalWallet,
        metaMaskWallet,
        coinbaseWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  { appName: "sosovalue", projectId: "33a4ab9a7814daf1ae74c572d742b47f" }
);

const config = createConfig({
  connectors,
  chains: [mainnet, polygon, optimism, arbitrum, base],
  transports: {
    [mainnet.id]: http(
      "https://eth-mainnet.g.alchemy.com/v2/4jCFqR4JdREHIOKiyqD_-D3Wd3uggpCY"
    ),
    [polygon.id]: http(polygon.rpcUrls.default.http[0]),
    [optimism.id]: http(polygon.rpcUrls.default.http[0]),
    [arbitrum.id]: http(polygon.rpcUrls.default.http[0]),
    [base.id]: http(polygon.rpcUrls.default.http[0]),
  },
  ssr: true,
});

const queryClient = new QueryClient();

const WalletStore = ({ children }: React.PropsWithChildren) => {
  const theme = useThemeStore((state) => state.theme);
  const { locale } = useRouter() as { locale: Locale };

  return (
    <WagmiProvider reconnectOnMount={false} config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale={locale}
          theme={theme === "light" ? lightTheme() : darkTheme()}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default WalletStore;
