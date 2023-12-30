import { PublicClient, createWalletClient, custom } from "viem";
import {
  Erc20,
  FeeFollowModuleSettings,
  LimitType,
  Profile,
} from "../../../../graphql/generated";
import approveCurrency from "../../../../graphql/lens/mutations/approve";
import isApprovedData from "../../../../graphql/lens/mutations/isApproved";
import { polygon, polygonMumbai } from "viem/chains";
import handleIndexCheck from "../../../../graphql/lens/queries/indexed";
import lensCollect from "../../../../lib/helpers/lensCollect";
import {
  FollowCollectState,
  setFollowCollect,
} from "../../../../redux/reducers/followCollectSlice";
import lensFollow from "../../../../lib/helpers/lensFollow";
import getEnabledCurrencies from "../../../../graphql/lens/queries/enabledCurrencies";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import { Dispatch } from "redux";
import { useEffect, useState } from "react";
import refetchProfile from "../../../../lib/helpers/refetchProfile";

const useFollowCollect = (
  dispatch: Dispatch,
  followCollect: FollowCollectState,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  availableCurrencies: Erc20[],
  lensConnected: Profile | undefined
) => {
  const [transactionLoading, setTransactionLoading] = useState<boolean>(false);
  const [informationLoading, setInformationLoading] = useState<boolean>(false);
  const [approved, setApproved] = useState<boolean>(true);

  const checkCurrencyApproved = async () => {
    setInformationLoading(true);
    try {
      const { data } = await isApprovedData({
        currencies:
          followCollect?.type === "collect"
            ? followCollect?.collect?.item?.amount?.asset.contract.address
            : (followCollect?.follower?.followModule as FeeFollowModuleSettings)
                ?.amount.asset.contract.address,
      });

      if (data && data.approvedModuleAllowanceAmount[0]) {
        parseInt(data.approvedModuleAllowanceAmount[0].allowance.value) >
        (followCollect?.type === "collect"
          ? parseInt(followCollect?.collect?.item?.amount?.value || "")
          : parseInt(
              (followCollect?.follower?.followModule as FeeFollowModuleSettings)
                ?.amount.value || ""
            ))
          ? setApproved(true)
          : setApproved(false);
      } else {
        setApproved(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setInformationLoading(false);
  };

  const approveSpend = async () => {
    setTransactionLoading(true);
    try {
      const { data } = await approveCurrency({
        allowance: {
          currency:
            followCollect?.type === "collect"
              ? followCollect?.collect?.item?.amount?.asset.contract.address!
              : (
                  followCollect?.follower
                    ?.followModule as FeeFollowModuleSettings
                )?.amount.asset.contract.address!,
          value:
            followCollect?.type === "collect"
              ? followCollect?.collect?.item?.amount?.value!
              : (
                  followCollect?.follower
                    ?.followModule as FeeFollowModuleSettings
                )?.amount.value!,
        },
        module: {
          openActionModule:
            (followCollect?.type === "collect" &&
              !followCollect?.collect?.item?.followerOnly) ||
            (followCollect?.type === "collect" &&
              followCollect?.collect?.item?.followerOnly &&
              followCollect?.follower?.operations?.isFollowedByMe?.value)
              ? followCollect?.collect?.item?.type
              : undefined,
          followModule:
            (followCollect?.type === "collect" &&
              followCollect?.collect?.item?.followerOnly &&
              !followCollect?.follower?.operations?.isFollowedByMe?.value) ||
            followCollect?.type === "follow"
              ? followCollect?.follower?.followModule?.type
              : undefined,
        },
      });

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const res = await clientWallet.sendTransaction({
        to: data?.generateModuleCurrencyApprovalData?.to as `0x${string}`,
        account: data?.generateModuleCurrencyApprovalData
          ?.from as `0x${string}`,
        value: data?.generateModuleCurrencyApprovalData?.data,
      });
      const tx = await publicClient.waitForTransactionReceipt({ hash: res });
      await handleIndexCheck(
        {
          forTxHash: tx.transactionHash,
        },
        dispatch
      );
      setApproved(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const handleCollect = async () => {
    setTransactionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        followCollect?.type === "collect"
          ? followCollect?.collect?.id
          : followCollect?.follower?.id,
        followCollect?.collect?.item?.__typename!,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      dispatch(
        setFollowCollect({
          actionType: undefined,
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const handleFollow = async () => {
    setTransactionLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        (followCollect?.type === "collect" &&
          !followCollect?.collect?.item?.followerOnly) ||
          (followCollect?.type === "collect" &&
            followCollect?.collect?.item?.followerOnly &&
            followCollect?.follower?.operations?.isFollowedByMe?.value)
          ? followCollect?.collect?.id
          : followCollect?.follower?.id,
        dispatch,
        followCollect?.follower?.followModule?.__typename !==
          "FeeFollowModuleSettings"
          ? undefined
          : (followCollect?.follower?.followModule as FeeFollowModuleSettings)
              ?.amount
          ? {
              feeFollowModule: {
                amount: {
                  currency: (
                    followCollect?.follower
                      ?.followModule as FeeFollowModuleSettings
                  )?.amount.asset.contract.address,
                  value: (
                    followCollect?.follower
                      ?.followModule as FeeFollowModuleSettings
                  )?.amount.value,
                },
              },
            }
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
      if (
        followCollect?.type === "collect" &&
        followCollect?.collect?.item?.followerOnly
      ) {
        dispatch(
          setFollowCollect({
            actionType: "collect",
            actionCollect: {
              id: followCollect?.collect?.id,
              stats: followCollect?.collect?.stats,
              item: followCollect?.collect?.item,
            },
            actionFollower: {
              ...followCollect?.follower,
              operations: {
                ...followCollect?.follower?.operations,
                isFollowedByMe: {
                  ...followCollect?.follower?.operations?.isFollowedByMe,
                  value: true,
                },
              },
            },
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setTransactionLoading(false);
  };

  const getCurrencies = async (): Promise<void> => {
    try {
      const response = await getEnabledCurrencies({
        limit: LimitType.TwentyFive,
      });
      if (response && response.data) {
        dispatch(setAvailableCurrencies(response.data.currencies.items));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (availableCurrencies?.length < 1) {
      getCurrencies();
    }
  }, []);

  useEffect(() => {
    if (
      (followCollect.type === "collect" &&
        followCollect?.follower?.followModule?.__typename ==
          "FeeFollowModuleSettings") ||
      (followCollect.type === "follow" &&
        followCollect?.follower?.followModule?.__typename ==
          "FeeFollowModuleSettings") ||
      (followCollect?.type === "collect" &&
        Number(followCollect?.collect?.item?.amount?.value) > 0)
    ) {
      checkCurrencyApproved();
    }
  }, [followCollect.type]);

  return {
    handleCollect,
    handleFollow,
    approveSpend,
    approved,
    transactionLoading,
    informationLoading,
  };
};

export default useFollowCollect;
