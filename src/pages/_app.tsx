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
import { polygon } from "viem/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { useRouter } from "next/router";
import Footer from "@/components/Layout/modules/Footer";
import Header from "@/components/Layout/modules/Header";
import Modals from "@/components/Modals/modules/Modals";
import {
  createReactClient,
  studioProvider,
  LivepeerConfig,
} from "@livepeer/react";
import { KinoraProvider } from "kinora-sdk";
import { createContext, useContext, useEffect, useState } from "react";
import RouterChange from "@/components/Common/modules/RouterChange";
import { apolloClient } from "../../lib/lens/client";
import Head from "next/head";

const walletTheme = merge(darkTheme(), {
  colors: {
    accentColor: "#111313",
  },
} as Theme);

interface Translations {
  [key: string]: string;
}

type LanguageContextType = {
  t: (key: keyof Translations) => string;
  setLocale: (locale: "es" | "en") => void;
  locale: "es" | "en";
};

const defaultState: LanguageContextType = {
  t: () => "",
  setLocale: () => {},
  locale: "en",
};

const LanguageContext = createContext<LanguageContextType>(defaultState);
export const useTranslation = (): LanguageContextType =>
  useContext(LanguageContext);

const { chains, publicClient } = configureChains(
  [polygon],
  [alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY! })]
);

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY!,
  }),
});

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

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<"en" | "es">();
  const [translations, setTranslations] = useState<Translations>({});
  const t = (key: keyof Translations) => translations[key] || (key as string);
  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  useEffect(() => {
    if (locale) {
      localStorage.setItem("locale", locale);
      fetch(`/locales/${locale}.json`)
        .then((res) => res.json())
        .then((data) => setTranslations(data));
    }
  }, [locale]);
  useEffect(() => {
    const handleStart = () => {
      setRouterChangeLoading(true);
    };

    const handleStop = () => {
      setRouterChangeLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleStop);
    router.events.on("routeChangeError", handleStop);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleStop);
      router.events.off("routeChangeError", handleStop);
    };
  }, [router]);

  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") || "en";
    setLocale(savedLocale as "en" | "es");
  }, []);

  if (routerChangeLoading) {
    return <RouterChange />;
  }

  return (
    <LanguageContext.Provider value={{ t, setLocale, locale: locale ?? "en" }}>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains} theme={walletTheme}>
          <LivepeerConfig client={livepeerClient}>
            <KinoraProvider playerAuthedApolloClient={apolloClient}>
              <Provider store={store}>
                <div className="relative w-full h-full flex bg-fuzz flex-col">
                  <Head>
                    <meta
                      name="keywords"
                      content="Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto, www.digitalax.xyz, www.f3manifesto.xyz, Women, Life, Freedom."
                    />
                    <meta name="robots" content="index, follow" />
                    <script
                      type="application/ld+json"
                      dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                          "@context": "https://schema.org",
                          "@type": "WebSite",
                          name: "Kinora",
                          description:
                            "Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto, www.digitalax.xyz, www.f3manifesto.xyz, Women, Life, Freedom.",
                          url: "https://www.kinora.irrevocable.dev/",
                        }),
                      }}
                    ></script>
                  </Head>
                  <Header router={router} />
                  <Component router={router} {...pageProps} />
                  <Modals router={router} />
                  <Footer router={router} />
                </div>
              </Provider>
            </KinoraProvider>
          </LivepeerConfig>
        </RainbowKitProvider>
      </WagmiConfig>
    </LanguageContext.Provider>
  );
}

export default App;
