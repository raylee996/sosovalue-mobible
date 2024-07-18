import { http } from 'wagmi';
import { Wallet, getWalletConnectConnector } from '@rainbow-me/rainbowkit';

export interface CustomWalletOptions {
  projectId: string;
};

const safePalWallet = ({ projectId }: CustomWalletOptions): Wallet => ({
  id: 'safepal-wallet',
  name: 'SafePal Wallet',
  iconUrl: '/img/wallet/sfp_logo.png',
  iconBackground: '#0c2f78',
  downloadUrls: {
    android: 'https://play.google.com/store/apps/details?id=io.safepal.wallet&referrer=utm_source%3Dsafepal.com%26utm_medium%3Ddisplay%26utm_campaign%3Ddownload&pli=1',
    ios: 'https://apps.apple.com/us/app/safepal-crypto-wallet-btc-nft/id1548297139',
    chrome: 'https://chromewebstore.google.com/detail/safepal%E6%8F%92%E4%BB%B6%E9%92%B1%E5%8C%85/lgmpcpglpngdoalbgeoldeajfclnhafa',
    qrCode: 'https://www.safepal.com/download',
  },
  mobile: {
    getUri: (uri: string) => uri,
  },
  qrCode: {
    // 设置二维码的的链接，默认会到MetaMask到APP（如果安装了）
    getUri: (uri: string) => uri,
    instructions: {
      learnMoreUrl: 'https://blog.safepal.com',
      steps: [],
    },
  },
  createConnector: getWalletConnectConnector({ projectId }),
});

export default safePalWallet;