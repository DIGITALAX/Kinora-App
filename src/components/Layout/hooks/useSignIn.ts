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

const useSignIn = (
  lensConnected: Profile | undefined,
  openAccountModal: (() => void) | undefined,
  dispatch: Dispatch,
  isConnected: boolean,
  address: `0x${string}` | undefined,
  allUploaded: Asset[]
) => {
  const { signMessageAsync } = useSignMessage();
  const [signLoading, setSignLoading] = useState<boolean>(false);
  const [accountOpen, setAccountOpen] = useState<boolean>(false);

  const handleLogIn = async () => {
    setSignLoading(true);
    try {
      const profile = await getDefaultProfile(
        {
          for: address,
        },
        lensConnected?.id
      );
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
    try {
      const data = await fetch("/api/livepeer", {
        method: "POST",
      });

      const res = await data.json();
      dispatch(setAllUploaded(res.json || []));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (allUploaded?.length < 1) {
      handleUploadAssets();
    }
  }, []);

  return {
    signLoading,
    accountOpen,
    setAccountOpen,
    handleLogIn,
    handleLogOut,
  };
};

export default useSignIn;
