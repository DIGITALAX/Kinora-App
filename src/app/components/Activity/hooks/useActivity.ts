import { useContext, useEffect, useState } from "react";
import { getQuests } from "../../../../../graphql/getQuests";
import { ModalContext } from "@/app/providers";
import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import {
  fetchAccountsAvailable,
  fetchPost,
} from "@lens-protocol/client/actions";
import { Quest } from "../../Common/types/common.types";
import { getPlayerJoined } from "../../../../../graphql/getPlayerJoined";
import {
  getCompletedMilestones,
  getCompletedQuest,
} from "../../../../../graphql/getCompleted";
import { getMetricsAdded } from "../../../../../graphql/getMetricsAdded";
import { getQuestById } from "../../../../../graphql/getQuest";
import { getVideoPlayerId } from "../../../../../graphql/getVideos";

const useActivity = () => {
  const context = useContext(ModalContext);
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [activityInfo, setActivityInfo] = useState<{
    hasMore: boolean;
    questDataCursor: number;
    newPlayerDataCursor: number;
    milestoneDataCursor: number;
    completionDataCursor: number;
    metricsDataCursor: number;
  }>({
    hasMore: true,
    questDataCursor: 0,
    newPlayerDataCursor: 0,
    milestoneDataCursor: 0,
    completionDataCursor: 0,
    metricsDataCursor: 0,
  });
  const [allCacheState, setAllCacheState] = useState<{
    profiles: Record<string, any>;
    quests: Record<string, any>;
    posts: Record<string, any>;
  }>({
    profiles: {},
    posts: {},
    quests: {},
  });

  const getActivityFeed = async () => {
    setActivityLoading(true);
    try {
      const questData = await getQuests(10, 0);
      const newPlayerData = await getPlayerJoined(10, 0);
      const milestoneData = await getCompletedMilestones(10, 0);
      const completionData = await getCompletedQuest(10, 0);
      const metricsData = await getMetricsAdded(10, 0);

      const cache = {
        profiles: {} as Record<string, any>,
        quests: {} as Record<string, any>,
        posts: {} as Record<string, any>,
      };

      const questPromises = questData?.data?.questInstantiateds?.map(
        async (item: any) => {
          let post;

          if (!cache.posts[item?.postId]) {
            const data = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: item?.postId,
              }
            );

            if (data?.isOk()) {
              cache.posts[item?.postId] = data?.value;
            }
          }
          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          post = cache.posts[item?.postId];

          return {
            ...item,
            post,
          };
        }
      );

      const playerPromises = newPlayerData?.data?.playerJoinedQuests?.map(
        async (item: any) => {
          let quest: Quest;

          if (!cache.quests[item?.questId]) {
            const data = await getQuestById(item?.questId);
            quest = data?.data?.questInstantiateds?.[0];

            if (!quest?.questMetadata) {
              let fetched = await fetchIPFSJSON(quest?.uri);
              quest = {
                ...quest,
                questMetadata: fetched,
              };
            }

            cache.quests[item?.questId] = quest;
          }

          quest = cache.quests[item?.questId];

          let profile;

          if (!cache.profiles[item?.playerProfile]) {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                managedBy: item?.playerProfile,
              }
            );

            if (data?.isOk()) {
              cache.profiles[item?.playerProfile] =
                data?.value?.items?.[0]?.account;
            }
          }
          profile = cache.profiles[item?.playerProfile];

          let post;

          if (!cache.posts[item?.postId]) {
            const data = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: item?.postId,
              }
            );

            if (data?.isOk()) {
              cache.posts[item?.postId] = data?.value;
            }
          }
          post = cache.posts[item?.postId];

          return {
            ...item,
            ...quest,
            profile,
            post,
          };
        }
      );

      const milestoneCompletedPromises =
        milestoneData?.data?.milestoneCompleteds?.map(async (item: any) => {
          let profile;

          if (!cache.profiles[item?.playerProfile]) {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                managedBy: item?.playerProfile,
              }
            );

            if (data?.isOk()) {
              cache.profiles[item?.playerProfile] =
                data?.value?.items?.[0]?.account;
            }
          }
          profile = cache.profiles[item?.playerProfile];

          let quest: Quest;

          if (!cache.quests[item?.questId]) {
            const data = await getQuestById(item?.questId);
            quest = data?.data?.questInstantiateds?.[0];

            if (!quest?.questMetadata) {
              let fetched = await fetchIPFSJSON(quest?.uri);
              quest = {
                ...quest,
                questMetadata: fetched,
              };
            }

            cache.quests[item?.questId] = quest;
          }

          quest = cache.quests[item?.questId];

          let post;

          if (!cache.posts[item?.postId]) {
            const data = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: item?.postId,
              }
            );

            if (data?.isOk()) {
              cache.posts[item?.postId] = data?.value;
            }
          }
          post = cache.posts[item?.postId];

          return {
            ...item,
            ...quest,
            profile,
            post,
          };
        });

      const completedPromises = completionData?.data?.questCompleteds?.map(
        async (item: any) => {
          let profile;

          if (!cache.profiles[item?.playerProfile]) {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                managedBy: item?.playerProfile,
              }
            );

            if (data?.isOk()) {
              cache.profiles[item?.playerProfile] =
                data?.value?.items?.[0]?.account;
            }
          }
          profile = cache.profiles[item?.playerProfile];

          let quest: Quest;

          if (!cache.quests[item?.questId]) {
            const data = await getQuestById(item?.questId);
            quest = data?.data?.questInstantiateds?.[0];

            if (!quest?.questMetadata) {
              let fetched = await fetchIPFSJSON(quest?.uri);
              quest = {
                ...quest,
                questMetadata: fetched,
              };
            }

            cache.quests[item?.questId] = quest;
          }

          quest = cache.quests[item?.questId];

          let post;

          if (!cache.posts[item?.postId]) {
            const data = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: item?.postId,
              }
            );

            if (data?.isOk()) {
              cache.posts[item?.postId] = data?.value;
            }
          }
          post = cache.posts[item?.postId];

          return {
            ...item,
            ...quest,
            profile,
            post,
          };
        }
      );

      const metricsPromises = metricsData?.data?.playerMetricsUpdateds?.map(
        async (item: any) => {
          let profile;

          const activityData = await getVideoPlayerId(item?.postId);

          const questData = await getQuestById(
            activityData?.data?.videos?.[0]?.questId
          );

          const fetchVideoDataPromises =
            questData?.data?.questInstantiateds?.[0]?.milestones
              ?.map(
                (milestone: {
                  uri: string;
                  videos: {
                    postId: string;
                  }[];
                }) => {
                  const index = milestone?.videos?.findIndex(
                    (vid) => Number(vid?.postId) === Number(item?.videoPostId)
                  );

                  if (index !== -1) {
                    return fetchIPFSJSON(milestone?.uri).then(
                      (data) => data?.videoCovers?.[index]
                    );
                  }
                  return null;
                }
              )
              .filter((promise: Promise<any>) => promise !== null);

          const videoDataArray = await Promise.all(fetchVideoDataPromises);
          const details = videoDataArray.find((data) => data !== undefined);

          if (!cache.profiles[item?.playerProfile]) {
            const data = await fetchAccountsAvailable(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                managedBy: item?.playerProfile,
              }
            );

            if (data?.isOk()) {
              cache.profiles[item?.playerProfile] =
                data?.value?.items?.[0]?.account;
            }
          }
          profile = cache.profiles[item?.playerProfile];

          let post;

          if (!cache.posts[item?.postId]) {
            const data = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: item?.postId,
              }
            );

            if (data?.isOk()) {
              cache.posts[item?.postId] = data?.value;
            }
          }
          post = cache.posts[item?.postId];

          return {
            ...item,
            details,
            profile,
            post: post,
          };
        }
      );

      const allQuests = (await Promise.all(questPromises))?.map((item) => ({
        ...item,
        type: "quest",
      }));
      const newPlayers = (await Promise.all(playerPromises))?.map((item) => ({
        ...item,
        type: "player",
      }));
      const newMilestones = (
        await Promise.all(milestoneCompletedPromises)
      )?.map((item) => ({
        ...item,
        completedImage: [
          "QmRBtzEqBnFgoHKr1Vkf5G4Y32ZwyBVKLua43mwtrVgmQo",
          "QmfQqn7CnVRrkDHmcEYeofcWS7xoqFxAxW8pWVYTzUMQqS",
          "QmPfh6SzzrCesndETLmTLw1CWUb51BoFfzkRJgvt2bghXs",
          "Qmd8GU3CTGqkgVdPZvHkQKvuNqQzU2xSoqw9MnbNhGhy5u",
          "QmYobgfsyUth61ZC1pZ6rDPpcPEZPj75PhJzFaRH7LPgjW",
          "QmU1GSjt6aqxz2Li9ynaXCReXd1HyHmdbRQ8oMH5LFDoSA",
          "QmSdULub95KyESom5DsxzXdZ5TjBighgZPCNiEm3mtgaSM",
          "QmZZjahdpxiYdki4gsGeKiuSDMLpWZqtXXmxn6WhCYnXuq",
        ]?.sort(() => 0.5 - Math.random())?.[0],
        type: "milestone",
      }));
      const newCompleted = (await Promise.all(completedPromises))?.map(
        (item) => ({
          ...item,
          completedImage: [
            "QmRBtzEqBnFgoHKr1Vkf5G4Y32ZwyBVKLua43mwtrVgmQo",
            "QmfQqn7CnVRrkDHmcEYeofcWS7xoqFxAxW8pWVYTzUMQqS",
            "QmPfh6SzzrCesndETLmTLw1CWUb51BoFfzkRJgvt2bghXs",
            "Qmd8GU3CTGqkgVdPZvHkQKvuNqQzU2xSoqw9MnbNhGhy5u",
            "QmYobgfsyUth61ZC1pZ6rDPpcPEZPj75PhJzFaRH7LPgjW",
            "QmU1GSjt6aqxz2Li9ynaXCReXd1HyHmdbRQ8oMH5LFDoSA",
            "QmSdULub95KyESom5DsxzXdZ5TjBighgZPCNiEm3mtgaSM",
            "QmZZjahdpxiYdki4gsGeKiuSDMLpWZqtXXmxn6WhCYnXuq",
          ]?.sort(() => 0.5 - Math.random())?.[0],
          type: "completed",
        })
      );
      const newMetrics = (await Promise.all(metricsPromises))?.map((item) => ({
        ...item,
        type: "metrics",
      }));

      setActivityInfo({
        hasMore:
          allQuests?.length == 10 ||
          newPlayers?.length == 10 ||
          newMilestones?.length == 10 ||
          newCompleted?.length == 10 ||
          newMetrics?.length == 10
            ? true
            : false,
        questDataCursor: allQuests?.length !== 10 ? 0 : 10,
        newPlayerDataCursor: newPlayers?.length !== 10 ? 0 : 10,
        milestoneDataCursor: newMilestones?.length !== 10 ? 0 : 10,
        completionDataCursor: newCompleted?.length !== 10 ? 0 : 10,
        metricsDataCursor: newMetrics?.length !== 10 ? 0 : 10,
      });

      context?.setActivityFeed(
        [
          ...allQuests,
          ...newPlayers,
          ...newMilestones,
          ...newCompleted,
          ...newMetrics,
        ]?.sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp))
      );

      setAllCacheState(cache);
    } catch (err: any) {
      console.error(err.message);
    }
    setActivityLoading(false);
  };

  const getMoreActivityFeed = async () => {
    if (!activityInfo?.hasMore) return;
    try {
      let questData, newPlayerData, milestoneData, completionData, metricsData;

      if (activityInfo?.questDataCursor !== 0) {
        questData = await getQuests(10, activityInfo?.questDataCursor);
      }

      if (activityInfo?.newPlayerDataCursor !== 0) {
        newPlayerData = await getPlayerJoined(
          10,
          activityInfo?.newPlayerDataCursor
        );
      }

      if (activityInfo?.milestoneDataCursor !== 0) {
        milestoneData = await getCompletedMilestones(
          10,
          activityInfo?.completionDataCursor
        );
      }

      if (activityInfo?.completionDataCursor !== 0) {
        completionData = await getCompletedQuest(
          10,
          activityInfo?.completionDataCursor
        );
      }

      if (activityInfo?.metricsDataCursor !== 0) {
        metricsData = await getMetricsAdded(
          10,
          activityInfo?.metricsDataCursor
        );
      }

      const cache = {
        profiles: allCacheState?.profiles,
        quests: allCacheState?.quests,
        posts: allCacheState?.posts,
      };

      const questPromises = (questData?.data?.questInstantiateds || [])?.map(
        async (item: any) => {
          let post;

          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          if (!cache.posts[item?.postId]) {
            const data = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: item?.postId,
              }
            );

            if (data?.isOk()) {
              cache.posts[item?.postId] = data?.value;
            }
          }
          post = cache.posts[item?.postId];

          return {
            ...item,
            post,
          };
        }
      );

      const playerPromises = (
        newPlayerData?.data?.playerJoinedQuests || []
      )?.map(async (item: any) => {
        let quest: Quest;

        if (!cache.quests[item?.questId]) {
          const data = await getQuestById(item?.questId);
          quest = data?.data?.questInstantiateds?.[0];

          if (!quest?.questMetadata) {
            let fetched = await fetchIPFSJSON(quest?.uri);
            quest = {
              ...quest,
              questMetadata: fetched,
            };
          }

          cache.quests[item?.questId] = quest;
        }

        quest = cache.quests[item?.questId];

        let profile;

        if (!cache.profiles[item?.playerProfile]) {
          const data = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: item?.playerProfile,
            }
          );

          if (data?.isOk()) {
            cache.profiles[item?.playerProfile] =
              data?.value?.items?.[0]?.account;
          }
        }
        profile = cache.profiles[item?.playerProfile];

        let post;

        if (!cache.posts[item?.postId]) {
          const data = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (data?.isOk()) {
            cache.posts[item?.postId] = data?.value;
          }
        }
        post = cache.posts[item?.postId];

        return {
          ...item,
          ...quest,
          profile,
          post,
        };
      });

      const milestoneCompletedPromises = (
        milestoneData?.data?.milestoneCompleteds || []
      )?.map(async (item: any) => {
        let profile;

        if (!cache.profiles[item?.playerProfile]) {
          const data = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: item?.playerProfile,
            }
          );

          if (data?.isOk()) {
            cache.profiles[item?.playerProfile] =
              data?.value?.items?.[0]?.account;
          }
        }
        profile = cache.profiles[item?.playerProfile];

        let quest: Quest;

        if (!cache.quests[item?.questId]) {
          const data = await getQuestById(item?.questId);
          quest = data?.data?.questInstantiateds?.[0];

          if (!quest?.questMetadata) {
            let fetched = await fetchIPFSJSON(quest?.uri);
            quest = {
              ...quest,
              questMetadata: fetched,
            };
          }

          cache.quests[item?.questId] = quest;
        }

        quest = cache.quests[item?.questId];

        let post;

        if (!cache.posts[item?.postId]) {
          const data = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (data?.isOk()) {
            cache.posts[item?.postId] = data?.value;
          }
        }
        post = cache.posts[item?.postId];

        return {
          ...item,
          ...quest,
          profile,
          post,
          milestone: item?.milestone,
        };
      });

      const completedPromises = (
        completionData?.data?.questCompleteds || []
      )?.map(async (item: any) => {
        let profile;

        if (!cache.profiles[item?.playerProfile]) {
          const data = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: item?.playerProfile,
            }
          );

          if (data?.isOk()) {
            cache.profiles[item?.playerProfile] =
              data?.value?.items?.[0]?.account;
          }
        }
        profile = cache.profiles[item?.playerProfile];
        let quest: Quest;

        if (!cache.quests[item?.questId]) {
          const data = await getQuestById(item?.questId);
          quest = data?.data?.questInstantiateds?.[0];

          if (!quest?.questMetadata) {
            let fetched = await fetchIPFSJSON(quest?.uri);
            quest = {
              ...quest,
              questMetadata: fetched,
            };
          }

          cache.quests[item?.questId] = quest;
        }

        quest = cache.quests[item?.questId];

        let post;

        if (!cache.posts[item?.postId]) {
          const data = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (data?.isOk()) {
            cache.posts[item?.postId] = data?.value;
          }
        }
        post = cache.posts[item?.postId];

        return {
          ...item,
          ...quest,
          profile,
          post,
        };
      });

      const metricsPromises = (
        metricsData?.data?.playerMetricsUpdateds || []
      )?.map(async (item: any) => {
        let profile;

        if (!cache.profiles[item?.playerProfile]) {
          const data = await fetchAccountsAvailable(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              managedBy: item?.playerProfile,
            }
          );

          if (data?.isOk()) {
            cache.profiles[item?.playerProfile] =
              data?.value?.items?.[0]?.account;
          }
        }
        profile = cache.profiles[item?.playerProfile];

        let post;

        if (!cache.posts[item?.postId]) {
          const data = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (data?.isOk()) {
            cache.posts[item?.postId] = data?.value;
          }
        }
        post = cache.posts[item?.postId];

        return {
          ...item,
          profile,
          post: post,
        };
      });

      const allQuests = (await Promise.all(questPromises))?.map((item) => ({
        ...item,
        type: "quest",
      }));
      const newPlayers = (await Promise.all(playerPromises))?.map((item) => ({
        ...item,
        type: "player",
      }));
      const newMilestones = (
        await Promise.all(milestoneCompletedPromises)
      )?.map((item) => ({
        ...item,
        completedImage: [
          "QmRBtzEqBnFgoHKr1Vkf5G4Y32ZwyBVKLua43mwtrVgmQo",
          "QmfQqn7CnVRrkDHmcEYeofcWS7xoqFxAxW8pWVYTzUMQqS",
          "QmPfh6SzzrCesndETLmTLw1CWUb51BoFfzkRJgvt2bghXs",
          "Qmd8GU3CTGqkgVdPZvHkQKvuNqQzU2xSoqw9MnbNhGhy5u",
          "QmYobgfsyUth61ZC1pZ6rDPpcPEZPj75PhJzFaRH7LPgjW",
          "QmU1GSjt6aqxz2Li9ynaXCReXd1HyHmdbRQ8oMH5LFDoSA",
          "QmSdULub95KyESom5DsxzXdZ5TjBighgZPCNiEm3mtgaSM",
          "QmZZjahdpxiYdki4gsGeKiuSDMLpWZqtXXmxn6WhCYnXuq",
        ]?.sort(() => 0.5 - Math.random())?.[0],
        type: "milestone",
      }));
      const newCompleted = (await Promise.all(completedPromises))?.map(
        (item) => ({
          ...item,
          completedImage: [
            "QmRBtzEqBnFgoHKr1Vkf5G4Y32ZwyBVKLua43mwtrVgmQo",
            "QmfQqn7CnVRrkDHmcEYeofcWS7xoqFxAxW8pWVYTzUMQqS",
            "QmPfh6SzzrCesndETLmTLw1CWUb51BoFfzkRJgvt2bghXs",
            "Qmd8GU3CTGqkgVdPZvHkQKvuNqQzU2xSoqw9MnbNhGhy5u",
            "QmYobgfsyUth61ZC1pZ6rDPpcPEZPj75PhJzFaRH7LPgjW",
            "QmU1GSjt6aqxz2Li9ynaXCReXd1HyHmdbRQ8oMH5LFDoSA",
            "QmSdULub95KyESom5DsxzXdZ5TjBighgZPCNiEm3mtgaSM",
            "QmZZjahdpxiYdki4gsGeKiuSDMLpWZqtXXmxn6WhCYnXuq",
          ]?.sort(() => 0.5 - Math.random())?.[0],
          type: "completed",
        })
      );
      const newMetrics = (await Promise.all(metricsPromises))?.map((item) => ({
        ...item,
        type: "metrics",
      }));

      setActivityInfo({
        hasMore:
          allQuests?.length == 10 ||
          newPlayers?.length == 10 ||
          newMilestones?.length == 10 ||
          newCompleted?.length == 10 ||
          newMetrics?.length == 10
            ? true
            : false,
        questDataCursor: allQuests?.length !== 10 ? 0 : 10,
        newPlayerDataCursor: newPlayers?.length !== 10 ? 0 : 10,
        milestoneDataCursor: newMilestones?.length !== 10 ? 0 : 10,
        completionDataCursor: newCompleted?.length !== 10 ? 0 : 10,
        metricsDataCursor: newMetrics?.length !== 10 ? 0 : 10,
      });

      context?.setActivityFeed((prev) => [
        ...(prev || []),
        ...[
          ...allQuests,
          ...newPlayers,
          ...newMilestones,
          ...newCompleted,
          ...newMetrics,
        ]?.sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (Number(context?.activityFeed?.length) < 1 && context?.clienteLens) {
      getActivityFeed();
    }
  }, [context?.lensConectado?.profile, context?.clienteLens]);

  return {
    activityLoading,
    getMoreActivityFeed,
    activityInfo,
  };
};

export default useActivity;
