import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";
import { setLensConnected } from "../../../../redux/reducers/lensConnectedSlice";
import {
  getAuthenticationToken,
  isAuthExpired,
  refreshAuth,
  removeAuthenticationToken,
  setAuthenticationToken,
} from "../../../../lib/utils";
import getDefaultProfile from "../../../../graphql/lens/queries/default";
import generateChallenge from "../../../../graphql/lens/queries/challenge";
import authenticate from "../../../../graphql/lens/mutations/authenticate";
import { useSignMessage } from "wagmi";
import { setWalletConnected } from "../../../../redux/reducers/walletConnectedSlice";
import { Asset } from "@livepeer/react";
import { setAllUploaded } from "../../../../redux/reducers/allUploadedSlice";
import { getPlayerData } from "../../../../graphql/subgraph/getPlayer";
import { setisPlayer } from "../../../../redux/reducers/isPlayerSlice";
import { setClaimProfile } from "../../../../redux/reducers/claimProfileSlice";
import { setOracleData } from "../../../../redux/reducers/oracleDataSlice";
import { OracleData } from "@/components/Storefront/types/storefront.types";
import { getOracle } from "../../../../graphql/subgraph/getOracle";

const useSignIn = (
  lensConnected: Profile | undefined,
  openAccountModal: (() => void) | undefined,
  dispatch: Dispatch,
  isConnected: boolean,
  address: `0x${string}` | undefined,
  allUploaded: Asset[],
  oracleData: OracleData[]
) => {
  const { signMessageAsync } = useSignMessage();
  const [signLoading, setSignLoading] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);
  const [assetLoading, setAssetLoading] = useState<boolean>(false);
  const [openActivitySample, setOpenActivitySample] = useState<boolean>(false);

  const handleLogIn = async () => {
    setSignLoading(true);
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );

      if (!profile?.data?.defaultProfile) {
        dispatch(setLensConnected(undefined));
        dispatch(setClaimProfile(true));
        setSignLoading(false);
        return;
      }
      const challengeResponse = await generateChallenge({
        for: profile?.data?.defaultProfile?.id,
        signedBy: address,
      });
      const signature = await signMessageAsync({
        message: challengeResponse.data?.challenge.text!,
      });
      const accessTokens = await authenticate({
        id: challengeResponse.data?.challenge.id,
        signature: signature,
      });
      if (accessTokens) {
        setAuthenticationToken({ token: accessTokens.data?.authenticate! });
        dispatch(setLensConnected(profile?.data?.defaultProfile as Profile));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSignLoading(false);
  };

  const handleLogOut = async () => {
    if (openAccountModal) {
      openAccountModal();
    }
    dispatch(setLensConnected(undefined));
    removeAuthenticationToken();

    setAccountOpen(false);
  };

  const handleRefreshProfile = async (): Promise<void> => {
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
      if (profile?.data?.defaultProfile) {
        dispatch(setLensConnected(profile?.data?.defaultProfile as Profile));
      } else {
        removeAuthenticationToken();
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    const handleAuthentication = async () => {
      const token = getAuthenticationToken();
      if (isConnected && !token) {
        dispatch(setLensConnected(undefined));
        removeAuthenticationToken();
      } else if (isConnected && token) {
        if (isAuthExpired(token?.exp)) {
          const refreshedAccessToken = await refreshAuth();
          if (!refreshedAccessToken) {
            removeAuthenticationToken();
          }
        }
        await handleRefreshProfile();
      }
    };

    handleAuthentication();
    dispatch(setWalletConnected(isConnected));
  }, [isConnected, address]);

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

      dispatch(setAllUploaded(allAssets || []));
      setAssetLoading(false);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkPlayer = async () => {
    try {
      const data = await getPlayerData(parseInt(lensConnected?.id, 16));
      if (data?.data?.players?.length > 0) {
        dispatch(setisPlayer(true));
      } else {
        dispatch(setisPlayer(false));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleOracles = async (): Promise<void> => {
    try {
      const data = await getOracle();

      dispatch(setOracleData(data?.data?.currencyAddeds));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allUploaded?.length < 1) {
      handleUploadAssets();
    }
  }, []);

  useEffect(() => {
    if (lensConnected?.id) {
      checkPlayer();
    }
  }, [lensConnected?.id]);

  useEffect(() => {
    if (!oracleData || oracleData?.length < 1) {
      handleOracles();
    }
  }, []);

  return {
    signLoading,
    accountOpen,
    setAccountOpen,
    handleLogIn,
    handleLogOut,
    openActivitySample,
    setOpenActivitySample,
  };
};

export default useSignIn;
