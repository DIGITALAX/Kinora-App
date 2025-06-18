import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import { useEffect, useState } from "react";
import { Reward } from "../../Common/types/common.types";
import { getAllRewards } from "../../../../../graphql/getAllRewards";

const useRewards = () => {
  const [rewardsLoading, setRewardsLoading] = useState<boolean>(false);
  const [moreLoading, setMoreLoading] = useState<boolean>(false);
  const [allRewards, setAllRewards] = useState<Reward[]>([]);
  const [rewardsInfo, setRewardsInfo] = useState<{
    hasMore: boolean;
    cursor: number;
  }>({
    hasMore: true,
    cursor: 0,
  });

  const getRewards = async () => {
    setRewardsLoading(true);
    try {
      const data = await getAllRewards(10, 0);

      if (data?.data?.rewards?.length > 0) {
        const promises = data?.data?.rewards?.map(async (reward: Reward) => {
          if (!reward.questMetadata) {
            const data = await fetchIPFSJSON(reward?.questURI);
            reward = {
              ...reward,
              questMetadata: data,
            };
          }

          if (!reward?.rewardMetadata) {
            const data = await fetchIPFSJSON(reward?.uri);
            return {
              ...reward,
              rewardMetadata: data,
            };
          } else {
            return reward;
          }
        });

        setAllRewards(await Promise.all(promises));
      }

      if (data?.data?.rewards?.length == 10) {
        setRewardsInfo({
          hasMore: true,
          cursor: 10,
        });
      } else {
        setRewardsInfo({
          ...rewardsInfo,
          hasMore: false,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setRewardsLoading(false);
  };

  const getMoreRewards = async () => {
    if (!rewardsInfo?.hasMore) return;
    setMoreLoading(true);
    try {
      const data = await getAllRewards(10, rewardsInfo?.cursor);
      if (data?.data?.rewards?.length > 0) {
        const promises = data?.data?.rewards?.map(async (reward: Reward) => {
          if (!reward.questMetadata) {
            const data = await fetchIPFSJSON(reward?.questURI);
            reward = {
              ...reward,
              questMetadata: data,
            };
          }

          if (!reward?.rewardMetadata) {
            const data = await fetchIPFSJSON(reward?.uri);
            return {
              ...reward,
              rewardMetadata: data,
            };
          } else {
            return reward;
          }
        });

        setAllRewards([...allRewards, ...(await Promise.all(promises))]);
      }

      if (data?.data?.rewards?.length == 10) {
        setRewardsInfo({
          hasMore: true,
          cursor: rewardsInfo?.cursor + 10,
        });
      } else {
        setRewardsInfo({
          cursor: 0,
          hasMore: false,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMoreLoading(false);
  };

  useEffect(() => {
    if (allRewards?.length < 1) {
      getRewards();
    }
  }, []);

  return {
    allRewards,
    rewardsLoading,
    rewardsInfo,
    getMoreRewards,
    moreLoading,
  };
};

export default useRewards;
