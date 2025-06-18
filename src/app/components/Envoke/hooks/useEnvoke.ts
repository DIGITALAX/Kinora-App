import { useContext, useEffect, useState } from "react";
import { Collection } from "../../Common/types/common.types";
import {
  getAllCollections,
  getCollectionSample,
} from "../../../../../graphql/getAllCollections";
import { fetchAccountsAvailable } from "@lens-protocol/client/actions";
import { ModalContext } from "@/app/providers";
import findBalance from "@/app/lib/helpers/findBalance";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { chains } from "@lens-chain/sdk/viem";

const useEnvoke = () => {
  const context = useContext(ModalContext);
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const { address } = useAccount();
  const [coverLoading, setCoverLoading] = useState<boolean>(false);
  const [balanceLoading, setBalanceLoading] = useState<boolean[]>([]);
  const [milestoneCoversLoading, setMilestoneCoversLoading] = useState<
    boolean[]
  >(Array.from({ length: 3 }, () => false));
  const [collectionsInfo, setCollectionsInfo] = useState<{
    hasMore: boolean;
    cursor: number;
  }>({
    hasMore: true,
    cursor: 25,
  });
  const [collectionsSearch, setCollectionsSearch] = useState<string>("");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [milestoneStage, setMilestoneStage] = useState<number>(0);
  const [milestonesOpen, setMilestonesOpen] = useState<boolean[]>([
    true,
    false,
    false,
  ]);

  const getCollectionsSample = async () => {
    try {
      const data = await getCollectionSample(25, 0);
      const colPromises = data?.data?.collectionCreateds?.map(
        async (coll: Collection) => {
          let profile;
          const res = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: coll?.designer,
              includeOwned: true,
            }
          );

          if (res?.isOk()) {
            profile = res?.value?.items?.[0]?.account;
          }

          return {
            ...coll,
            profile,
          };
        }
      );

      const allColls = await Promise.all(colPromises);

      setCollections(allColls);
      setCollectionsInfo({
        hasMore: allColls?.length == 25 ? true : false,
        cursor: 25,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreCollectionsSample = async () => {
    if (!collectionsInfo?.hasMore) return;
    try {
      const data = await getCollectionSample(25, collectionsInfo?.cursor);
      const colPromises = data?.data?.collectionCreateds?.map(
        async (coll: Collection) => {
          let profile;
          const res = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: coll?.designer,
              includeOwned: true,
            }
          );

          if (res?.isOk()) {
            profile = res?.value?.items?.[0]?.account;
          }
          return {
            ...coll,
            profile,
          };
        }
      );
      const allColls = await Promise.all(colPromises);

      setCollections([...collections, ...allColls]);
      setCollectionsInfo({
        hasMore: allColls?.length == 25 ? true : false,
        cursor: collectionsInfo?.cursor + 25,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };


  const getCollectionsSearch = async () => {
    try {
      const data = await getAllCollections(collectionsSearch, 25, 0);
      const colPromises = data?.data?.collectionCreateds?.map(
        async (coll: Collection) => {
          let profile;
          const res = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: coll?.designer,
              includeOwned: true,
            }
          );

          if (res?.isOk()) {
            profile = res?.value?.items?.[0]?.account;
          }

          return {
            ...coll,
            profile,
          };
        }
      );

      const allColls = await Promise.all(colPromises);

      setCollections(allColls);
      setCollectionsInfo({
        hasMore: allColls?.length == 25 ? true : false,
        cursor: 25,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMoreCollectionsSearch = async () => {
    if (!collectionsInfo?.hasMore) return;
    try {
      const data = await getAllCollections(
        collectionsSearch,
        25,
        collectionsInfo?.cursor
      );
      const colPromises = data?.data?.collectionCreateds?.map(
        async (coll: Collection) => {
          let profile;
          const res = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: coll?.designer,
              includeOwned: true,
            }
          );

          if (res?.isOk()) {
            profile = res?.value?.items?.[0]?.account;
          }
          return {
            ...coll,
            profile,
          };
        }
      );
      const allColls = await Promise.all(colPromises);

      setCollections([...collections, ...allColls]);
      setCollectionsInfo({
        hasMore: allColls?.length == 25 ? true : false,
        cursor: collectionsInfo?.cursor + 25,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (collections?.length < 1 && context?.clienteLens) {
      getCollectionsSample();
    }
  }, [context?.clienteLens]);

  const handleBalance = async (
    milestoneIndex: number,
    rewardIndex: number
  ): Promise<void> => {
    setBalanceLoading((prev) => {
      const arr = [...prev];
      arr[rewardIndex] = true;
      return arr;
    });
    try {
      const allMilestones = [...(context?.questInfo?.milestones || [])];
      const rewards20 = [...allMilestones[milestoneIndex]?.rewards?.rewards20];

      rewards20[rewardIndex] = {
        ...rewards20[rewardIndex],
        balance:
          Number(
            await findBalance(
              publicClient,
              rewards20[rewardIndex]?.address,
              address as `0x${string}`
            )
          ) <
          Number(rewards20[rewardIndex]?.amount) *
            Number(context?.questInfo?.details?.maxPlayerCount)
            ? false
            : true,
      };
      allMilestones[milestoneIndex] = {
        ...allMilestones[milestoneIndex],
        rewards: {
          ...allMilestones[milestoneIndex]?.rewards,
          rewards20,
        },
      };
      context?.setQuestInfo((prev) => ({
        ...prev,
        milestones: allMilestones,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setBalanceLoading((prev) => {
      const arr = [...prev];
      arr[rewardIndex] = false;
      return arr;
    });
  };

  return {
    coverLoading,
    milestonesOpen,
    setMilestonesOpen,
    setCoverLoading,
    milestoneCoversLoading,
    setMilestoneCoversLoading,
    milestoneStage,
    setMilestoneStage,
    collections,
    collectionsSearch,
    setCollectionsSearch,
    getMoreCollectionsSearch,
    getCollectionsSearch,
    collectionsInfo,
    getMoreCollectionsSample,
    setCollectionsInfo,
    handleBalance,
    balanceLoading,
  };
};

export default useEnvoke;
