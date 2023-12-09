import { useEffect, useState } from "react";
import { Collection, ERC20Reward, Milestone } from "../types/envoke.types";
import {
  getAllCollections,
  getCollectionSample,
} from "../../../../graphql/subgraph/getAllCollections";
import getProfile from "../../../../graphql/lens/queries/profile";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import { PublicClient } from "viem";
import { Dispatch } from "redux";
import {
  QuestInfoState,
  setQuestInfo,
} from "../../../../redux/reducers/questInfoSlice";
import findBalance from "../../../../lib/helpers/findBalance";

const useEnvoke = (
  publicClient: PublicClient,
  dispatch: Dispatch,
  questInfo: QuestInfoState,
  address: `0x${string}` | undefined
) => {
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
          const prof = await getProfile(
            {
              forProfileId: "0x" + toHexWithLeadingZero(Number(coll.profileId)),
            },
            true
          );

          return {
            ...coll,
            profile: prof?.data?.profile,
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
          const prof = await getProfile(
            {
              forProfileId: "0x" + toHexWithLeadingZero(Number(coll.profileId)),
            },
            true
          );

          return {
            ...coll,
            profile: prof?.data?.profile,
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
      const data = await getAllCollections(
        collectionsSearch,
        collectionsSearch,
        25,
        0
      );
      const colPromises = data?.data?.collectionCreateds?.map(
        async (coll: Collection) => {
          const prof = await getProfile(
            {
              forProfileId: "0x" + toHexWithLeadingZero(Number(coll.profileId)),
            },
            true
          );

          return {
            ...coll,
            profile: prof?.data?.profile,
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
        collectionsSearch,
        25,
        collectionsInfo?.cursor
      );
      const colPromises = data?.data?.collectionCreateds?.map(
        async (coll: Collection) => {
          const prof = await getProfile(
            {
              forProfileId: "0x" + toHexWithLeadingZero(Number(coll.profileId)),
            },
            true
          );

          return {
            ...coll,
            profile: prof?.data?.profile,
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
    if (collections?.length < 1) {
      getCollectionsSample();
    }
  }, []);

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
      const allMilestones = [...questInfo?.milestones];
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
          ) < Number(rewards20[rewardIndex]?.amount)
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

      dispatch(
        setQuestInfo({
          actionDetails: questInfo?.details,
          actionDeveloperKey: questInfo?.developerKey,
          actionMilestones: allMilestones,
        })
      );
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
