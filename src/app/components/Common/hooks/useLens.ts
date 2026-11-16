import {
  Account,
  evmAddress,
  MainContentFocus,
  PageSize,
  Post,
  PostType,
  VideoMetadata,
} from "@lens-protocol/client";
import {
  fetchAccount,
  fetchAccountsAvailable,
  fetchPosts,
  revokeAuthentication,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { chains } from "@lens-chain/sdk/viem";
import { ModalContext } from "@/app/providers";
import { usePathname, useRouter } from "next/navigation";
import { getOracleData } from "../../../../../graphql/getOracleData";
import { KINORA_ACCESS_CONTROL } from "@/app/lib/constants";
import { getPlayerData } from "../../../../../graphql/getPlayer";
import { getApolloLens } from "@/app/lib/lens/client";
import { UploadedVideo } from "../types/common.types";
import getVideoIdentifier from "@/app/lib/helpers/getVideoIdentifier";

const useLens = (
  isConnected: boolean,
  address: `0x${string}` | undefined,
  dict: any
) => {
  const contexto = useContext(ModalContext);
  const router = useRouter();
  const path = usePathname();
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const [assetLoading, setAssetLoading] = useState<boolean>(false);
  const [lensCargando, setLensCargando] = useState<boolean>(false);
  const [openAccount, setOpenAccount] = useState<boolean>(false);
  const [openActivitySample, setOpenActivitySample] = useState<boolean>(false);

  const changeLanguage = () => {
    const segments = path.split("/");
    segments[1] = path.includes("/en/") ? "es" : "en";
    const newPath = segments.join("/");

    document.cookie = `NEXT_LOCALE=${
      path.includes("/en/") ? "es" : "en"
    }; path=/; SameSite=Lax`;

    router.push(newPath);
  };

  const resumeLensSession = async () => {
    try {
      const resumed = await contexto?.clienteLens?.resumeSession();

      if (resumed?.isOk()) {
        const auth = await resumed.value.getAuthenticatedUser();

        if (auth.isOk()) {
          const accounts = await fetchAccount(resumed.value, {
            address: auth.value.address,
          });

          if (accounts.isErr()) {
            return;
          }

          contexto?.setLensConectado?.({
            profile: accounts?.value as Account,
            sessionClient: resumed?.value,
            apollo: getApolloLens(await resumed.value?.getCredentials()),
          });
        }
      }
    } catch (err) {
      console.error("Error al reanudar la sesión:", err);
      return null;
    }
  };

  useEffect(() => {
    if (contexto?.clienteLens && address && !contexto?.lensConectado?.profile) {
      resumeLensSession();
    }
  }, [address, contexto?.clienteLens]);

  const handleConectarse = async () => {
    if (!address || !contexto?.clienteLens) return;
    setLensCargando(true);
    setOpenAccount(false);
    try {
      const signer = createWalletClient({
        chain: chains.mainnet,
        transport: custom(window.ethereum!),
        account: address,
      });
      const accounts = await fetchAccountsAvailable(contexto?.clienteLens, {
        managedBy: evmAddress(signer.account.address),
        includeOwned: true,
      });

      if (accounts.isErr()) {
        setLensCargando(false);
        return;
      }
      if (accounts.value.items?.[0]?.account?.address) {
        const authenticated = await contexto?.clienteLens?.login({
          accountOwner: {
            account: evmAddress(accounts.value.items?.[0]?.account?.address),
            owner: signer.account?.address?.toLowerCase(),
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticated.isErr()) {
          console.error(authenticated.error);
          contexto?.setModalOpen?.(dict.error);
          setLensCargando(false);
          return;
        }

        const sessionClient = authenticated.value;

        contexto?.setLensConectado?.({
          sessionClient,
          profile: accounts.value.items?.[0]?.account,
          apollo: getApolloLens(await authenticated.value?.getCredentials()),
        });
      } else {
        const authenticatedOnboarding = await contexto?.clienteLens.login({
          onboardingUser: {
            wallet: signer.account.address,
          },
          signMessage: (message) => signer.signMessage({ message }),
        });

        if (authenticatedOnboarding.isErr()) {
          console.error(authenticatedOnboarding.error);
          contexto?.setModalOpen?.(dict.error);

          setLensCargando(false);
          return;
        }

        const sessionClient = authenticatedOnboarding.value;

        contexto?.setLensConectado?.({
          sessionClient,
          apollo: getApolloLens(
            await authenticatedOnboarding.value?.getCredentials()
          ),
        });

        contexto?.setCrearCuenta?.(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setLensCargando(false);
  };

  const salir = async () => {
    setLensCargando(true);
    try {
      const auth =
        await contexto?.lensConectado?.sessionClient?.getAuthenticatedUser();

      if (auth?.isOk()) {
        await revokeAuthentication(contexto?.lensConectado?.sessionClient!, {
          authenticationId: auth.value?.authenticationId,
        });

        contexto?.setLensConectado?.(undefined);
        window.localStorage.removeItem("lens.mainnet.credentials");
      }

      setOpenAccount(false);
    } catch (err: any) {
      console.error(err.message);
    }
    setLensCargando(false);
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracleData();
      contexto?.setOracleData(data?.data?.currencyAddeds);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleIsCreator = async () => {
    if (!address) return;
    try {
      const data = await publicClient.readContract({
        address: KINORA_ACCESS_CONTROL,
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "_address",
                type: "address",
              },
            ],
            name: "isEnvoker",
            outputs: [
              {
                internalType: "bool",
                name: "",
                type: "bool",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        ],
        functionName: "isEnvoker",
        args: [address as `0x${string}`],
      });

      if (data) {
        contexto?.setIsEnvoker(data as boolean);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkPlayer = async () => {
    try {
      const data = await getPlayerData(
        contexto?.lensConectado?.profile?.address
      );
      if (data?.data?.players?.length > 0) {
        contexto?.setIsPlayer(true);
      } else {
        contexto?.setIsPlayer(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleUploadAssets = async () => {
    const author = contexto?.lensConectado?.profile?.address;
    if (assetLoading || !author || !contexto?.clienteLens) return;
    setAssetLoading(true);
    try {
      let hasMore = true;
      let page: number = 0;
      let cursor: string | undefined = undefined;
      let allAssets: UploadedVideo[] = [];

      while (hasMore && page < 20) {
        const res: Awaited<ReturnType<typeof fetchPosts>> = await fetchPosts(
          contexto?.lensConectado?.sessionClient ?? contexto?.clienteLens,
          {
            cursor,
            filter: {
              authors: [author],
              postTypes: [PostType.Root],
              metadata: {
                mainContentFocus: [MainContentFocus.Video],
              },
            },
            pageSize: PageSize.Fifty,
          }
        );

        if (res.isErr()) {
          console.error("Error fetching uploaded videos:", res.error);
          hasMore = false;
          break;
        }

        const videos: UploadedVideo[] = (res.value.items as Post[])
          .map((post) => {
            const url: string =
              (post?.metadata as VideoMetadata)?.video?.item ?? "";
            const cid = getVideoIdentifier(url);

            return {
              id: post?.id,
              playbackId: cid,
              storage: {
                ipfs: {
                  cid,
                },
              },
              source: {
                url,
              },
            };
          })
          .filter(
            (video) =>
              video.playbackId &&
              !allAssets.some((asset) => asset.id == video.id)
          );

        allAssets = [...allAssets, ...videos];
        cursor = (res.value.pageInfo?.next ?? undefined) as string | undefined;

        if (res.value.items.length < 50 || !cursor) {
          hasMore = false;
          break;
        } else {
          page++;
        }
      }

      contexto?.setAllUploaded(allAssets);
      setAssetLoading(false);
    } catch (err: any) {
      console.error("Error fetching uploaded videos:", err.message);
      setAssetLoading(false);
    }
  };

  useEffect(() => {
    if (contexto?.lensConectado?.profile) {
      checkPlayer();
    }
  }, [contexto?.lensConectado?.profile]);

  useEffect(() => {
    if (
      !isConnected &&
      contexto?.lensConectado?.profile &&
      contexto?.clienteLens
    ) {
      salir();
    }
  }, [isConnected]);

  useEffect(() => {
    if (Number(contexto?.oracleData?.length) < 1) {
      handleOracles();
    }
  }, []);

  useEffect(() => {
    if (address) {
      handleIsCreator();
    }
  }, [address]);

  useEffect(() => {
    if (contexto?.lensConectado?.profile?.address && contexto?.clienteLens) {
      handleUploadAssets();
    } else if (Number(contexto?.allUploaded?.length) > 0) {
      contexto?.setAllUploaded([]);
    }
  }, [contexto?.lensConectado?.profile?.address, contexto?.clienteLens]);

  return {
    lensCargando,
    salir,
    handleConectarse,
    openActivitySample,
    setOpenActivitySample,
    openAccount,
    setOpenAccount,
    changeLanguage,
  };
};

export default useLens;
