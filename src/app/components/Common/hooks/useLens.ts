import { Account, evmAddress } from "@lens-protocol/client";
import {
  fetchAccount,
  fetchAccountsAvailable,
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
import { Asset } from "@livepeer/react";
import { getApolloLens } from "@/app/lib/lens/client";

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
        const auth = resumed.value.getAuthenticatedUser();

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
            apollo: getApolloLens(resumed.value?.getCredentials()),
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
          apollo: getApolloLens(authenticated.value?.getCredentials()),
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
            authenticatedOnboarding.value?.getCredentials()
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
        contexto?.lensConectado?.sessionClient?.getAuthenticatedUser();

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
    if (assetLoading) return;
    setAssetLoading(true);
    try {
      let hasMore = true;
      let page: number = 1;
      let allAssets: Asset[] = [];

      while (hasMore) {
        const formData = new FormData();
        formData.append("page", page.toString());
        const data = await fetch("/api/livepeer", {
          method: "POST",
          body: formData,
        });

        const res = await data.json();
        allAssets = [...allAssets, ...(res || [])];
        if (
          res?.length < 1000 ||
          allAssets?.some((asset) => asset?.id == res?.[0]?.id)
        ) {
          hasMore = false;
          break;
        } else {
          page++;
        }
      }

      contexto?.setAllUploaded(allAssets || []);
      setAssetLoading(false);
    } catch (err: any) {
      console.error(err.message);
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
    if (Number(contexto?.allUploaded?.length) < 1) {
      handleUploadAssets();
    }
  }, []);

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
