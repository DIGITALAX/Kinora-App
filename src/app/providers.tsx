"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, createConfig, http } from "wagmi";
import {
  createContext,
  SetStateAction,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Context, Post, PublicClient, mainnet } from "@lens-protocol/client";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { StorageClient } from "@lens-chain/storage-client";
import { chains } from "@lens-chain/sdk/viem";
import { usePathname } from "next/navigation";
import { Asset } from "@livepeer/react";
import {
  createReactClient,
  studioProvider,
  LivepeerConfig,
} from "@livepeer/react";
import { KinoraProvider } from "kinora-sdk";
import {
  AccountType,
  Collection,
  Indexar,
  LensConnected,
  OracleData,
  Quest,
  SimpleCollect,
} from "./components/Common/types/common.types";
import {
  MediaImageMimeType,
  MediaVideoMimeType,
} from "@lens-protocol/metadata";
import {
  MilestoneEnvoke,
  QuestDetails,
  QuestStage,
} from "./components/Envoke/types/envoke.types";
import { Account } from "viem";
import { getApolloLens } from "./lib/lens/client";
import RouterChange from "./components/Common/modules/RouterChange";

export const config = createConfig(
  getDefaultConfig({
    appName: "Kinora",
    walletConnectProjectId: process.env
      .NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
    appUrl: "https://kinora.irrevocable.dev",
    appIcon: "https://kinora.irrevocable.dev/favicon.ico",
    chains: [chains.mainnet],
    connectors: [],
    transports: {
      [chains.mainnet.id]: http("https://rpc.lens.xyz"),
    },
    ssr: true,
  })
);

const queryClient = new QueryClient();

const livepeerClient = createReactClient({
  provider: studioProvider({
    apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY!,
  }),
});

export const ModalContext = createContext<
  | {
      routerChangeLoading: boolean;
      setRouterChangeLoading: (e: SetStateAction<boolean>) => void;
      allUploaded: Asset[];
      setAllUploaded: (e: SetStateAction<Asset[]>) => void;
      accountType: AccountType;
      setAccountType: (e: SetStateAction<AccountType>) => void;
      followBox:
        | {
            id: string;
            type: string;
          }
        | undefined;
      setFollowBox: (
        e: SetStateAction<
          | {
              id: string;
              type: string;
            }
          | undefined
        >
      ) => void;
      questGates:
        | {
            erc20?: {
              address: string;
              amount: string;
            }[];
            erc721?: Collection[];
            oneOf?: boolean;
          }
        | undefined;
      setQuestGates: (
        e: SetStateAction<
          | {
              erc20?: {
                address: string;
                amount: string;
              }[];
              erc721?: Collection[];
              oneOf?: boolean;
            }
          | undefined
        >
      ) => void;
      isPlayer: boolean;
      setIsPlayer: (e: SetStateAction<boolean>) => void;
      missingValues: boolean;
      setMissingValues: (e: SetStateAction<boolean>) => void;
      questInfo: {
        details: QuestDetails;
        milestones: MilestoneEnvoke[];
      };
      setQuestInfo: (
        e: SetStateAction<{
          details: QuestDetails;
          milestones: MilestoneEnvoke[];
        }>
      ) => void;
      isEnvoker: boolean;
      setIsEnvoker: (e: SetStateAction<boolean>) => void;
      oracleData: OracleData[];
      setOracleData: (e: SetStateAction<OracleData[]>) => void;
      success:
        | {
            text: string;
            image: string;
          }
        | undefined;
      setSuccess: (
        e: SetStateAction<
          | {
              text: string;
              image: string;
            }
          | undefined
        >
      ) => void;
      postInfo: {
        collectTypes?: {
          [key: string]: SimpleCollect | undefined;
        };
        media?: {
          [key: string]: {
            item: string;
            type: MediaImageMimeType | MediaVideoMimeType;
          }[];
        };
      };
      setPostInfo: (
        e: SetStateAction<{
          collectTypes?: {
            [key: string]: SimpleCollect | undefined;
          };
          media?: {
            [key: string]: {
              item: string;
              type: MediaImageMimeType | MediaVideoMimeType;
            }[];
          };
        }>
      ) => void;
      quote: {
        open: boolean;
        post?: Post;
      };
      setQuote: (
        e: SetStateAction<{
          open: boolean;
          post?: Post;
        }>
      ) => void;
      modalOpen: string | undefined;
      setModalOpen: (e: SetStateAction<string | undefined>) => void;
      openSidebar: boolean;
      setOpenSidebar: (e: SetStateAction<boolean>) => void;
      signless: boolean;
      setSignless: (e: SetStateAction<boolean>) => void;
      setCrearCuenta: (e: SetStateAction<boolean>) => void;
      crearCuenta: boolean;
      indexar: Indexar;
      setIndexar: (e: SetStateAction<Indexar>) => void;
      imageViewer:
        | {
            image: string;
            type: string;
          }
        | undefined;
      setImageViewer: (
        e: SetStateAction<
          | {
              image: string;
              type: string;
            }
          | undefined
        >
      ) => void;
      questStage: QuestStage;
      setQuestStage: (e: SetStateAction<QuestStage>) => void;
      clienteLens: PublicClient<Context> | undefined;
      activityFeed: (Quest & {
        type: string;
        profile: Account | undefined;
      })[];
      setActivityFeed: (
        e: SetStateAction<
          (Quest & {
            type: string;
            profile: Account | undefined;
          })[]
        >
      ) => void;
      lensConectado: LensConnected | undefined;
      setLensConectado: (e: SetStateAction<LensConnected | undefined>) => void;
      clienteAlmacenamiento: StorageClient | undefined;
      questFeed: Quest[];
      setQuestFeed: (e: SetStateAction<Quest[]>) => void;
      gif: {
        open: boolean;
        id?: string;
      };
      setGif: (
        e: SetStateAction<{
          open: boolean;
          id?: string;
        }>
      ) => void;
      collectOptions: {
        open: boolean;
        id?: string;
      };
      setCollectOptions: (
        e: SetStateAction<{
          open: boolean;
          id?: string;
        }>
      ) => void;
    }
  | undefined
>(undefined);

export default function Providers({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [followBox, setFollowBox] = useState<
    | {
        id: string;
        type: string;
      }
    | undefined
  >();
  const [accountType, setAccountType] = useState<AccountType>(AccountType.Home);
  const [questGates, setQuestGates] = useState<
    | {
        erc20?: {
          address: string;
          amount: string;
        }[];
        erc721?: Collection[];
        oneOf?: boolean;
      }
    | undefined
  >();
  const [imageViewer, setImageViewer] = useState<
    | {
        image: string;
        type: string;
      }
    | undefined
  >();
  const [success, setSuccess] = useState<
    | {
        image: string;
        text: string;
      }
    | undefined
  >();
  const [questInfo, setQuestInfo] = useState<{
    details: QuestDetails;
    milestones: MilestoneEnvoke[];
  }>({
    details: {
      title: "",
      description: "",
      cover: "",
      tags: "",
      maxPlayerCount: 100,
      gated: {
        erc721Addresses: [],
        erc721TokenIds: [],
        erc20Addresses: [],
        erc20Thresholds: [],
        oneOf: true,
      },
    },
    milestones: [],
  });
  const [gif, setGif] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
  });
  const [collectOptions, setCollectOptions] = useState<{
    open: boolean;
    id?: string;
  }>({
    open: false,
  });
  const [questStage, setQuestStage] = useState<QuestStage>(QuestStage.Details);
  const [clienteLens, setClienteLens] = useState<PublicClient>();
  const [crearCuenta, setCrearCuenta] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [isEnvoker, setIsEnvoker] = useState<boolean>(false);
  const clienteAlmacenamiento = StorageClient.create();
  const [lensConectado, setLensConectado] = useState<LensConnected>();
  const [signless, setSignless] = useState<boolean>(false);
  const [isPlayer, setIsPlayer] = useState<boolean>(false);
  const [missingValues, setMissingValues] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<string | undefined>();
  const [indexar, setIndexar] = useState<Indexar>(Indexar.Inactive);
  const [questFeed, setQuestFeed] = useState<Quest[]>([]);
  const [oracleData, setOracleData] = useState<OracleData[]>([]);
  const [activityFeed, setActivityFeed] = useState<
    (Quest & {
      type: string;
      profile: Account | undefined;
    })[]
  >([]);
  const [quote, setQuote] = useState<{
    open: boolean;
    post?: Post;
  }>({
    open: false,
  });
  const [allUploaded, setAllUploaded] = useState<Asset[]>([]);
  const [routerChangeLoading, setRouterChangeLoading] =
    useState<boolean>(false);
  const [postInfo, setPostInfo] = useState<{
    collectTypes?: {
      [key: string]: SimpleCollect | undefined;
    };
    media?: {
      [key: string]: {
        item: string;
        type: MediaImageMimeType | MediaVideoMimeType;
      }[];
    };
  }>({});

  useEffect(() => {
    if (!clienteLens) {
      setClienteLens(
        PublicClient.create({
          environment: mainnet,
          storage: window.localStorage,
        })
      );
    }
  }, []);

  const apolloClient = useMemo(() => {
    return getApolloLens(
      lensConectado?.sessionClient?.getCredentials()!
    ) as any;
  }, [lensConectado?.sessionClient]);

  useEffect(() => {
    if (routerChangeLoading) {
      setTimeout(() => setRouterChangeLoading(false), 3000);
    }
  }, [routerChangeLoading]);

  if (routerChangeLoading) {
    return <RouterChange />;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-font-family": '"Manaspace", cursive',
          }}
        >
          <LivepeerConfig client={livepeerClient}>
            <KinoraProvider playerAuthedApolloClient={apolloClient}>
              <ModalContext.Provider
                value={{
                  allUploaded,
                  setAllUploaded,
                  accountType,
                  setAccountType,
                  followBox,
                  setFollowBox,
                  questGates,
                  setQuestGates,
                  isPlayer,
                  setIsPlayer,
                  activityFeed,
                  setActivityFeed,
                  routerChangeLoading,
                  setRouterChangeLoading,
                  missingValues,
                  setMissingValues,
                  questInfo,
                  setQuestInfo,
                  questStage,
                  setQuestStage,
                  isEnvoker,
                  setIsEnvoker,
                  oracleData,
                  setOracleData,
                  success,
                  setSuccess,
                  gif,
                  setGif,
                  collectOptions,
                  setCollectOptions,
                  postInfo,
                  setPostInfo,
                  quote,
                  setQuote,
                  modalOpen,
                  setModalOpen,
                  questFeed,
                  setQuestFeed,
                  openSidebar,
                  setOpenSidebar,
                  imageViewer,
                  setImageViewer,
                  indexar,
                  setIndexar,
                  crearCuenta,
                  setCrearCuenta,
                  clienteLens,
                  clienteAlmacenamiento,
                  lensConectado,
                  setLensConectado,
                  signless,
                  setSignless,
                }}
              >
                <div
                  className={`relative w-full h-auto flex flex-col ${
                    path?.includes("autograph") ? "bg-black" : "bg-offBlack"
                  }`}
                >
                  {children}
                </div>
              </ModalContext.Provider>
            </KinoraProvider>
          </LivepeerConfig>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
