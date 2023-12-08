import type { AppProps } from "next/app";
import "@/styles/globals.css";
import { store } from "./../../redux/store";
import { Provider } from "react-redux";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
  Theme,
} from "@rainbow-me/rainbowkit";
import merge from "lodash.merge";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { polygon } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useRouter } from "next/router";
import Footer from "@/components/Layout/modules/Footer";
import Header from "@/components/Layout/modules/Header";
import Modals from "@/components/Modals/modules/Modals";

const walletTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#111313",
  },
} as Theme);

const { chains, publicClient } = configureChains(
  [polygon],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);

const { connectors } = getDefaultWallets({
  appName: "Kinora",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={walletTheme}>
        <Provider store={store}>
          <div className="relative w-full h-full flex bg-nave flex-col">
            <Header router={router} />
            <Component router={router} {...pageProps} />
            <Modals router={router} />
            <Footer router={router} />
          </div>
        </Provider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
