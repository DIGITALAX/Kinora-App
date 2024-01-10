import { useEffect, useState } from "react";
import { Post, Profile } from "../../../../graphql/generated";
import { Quest } from "@/components/Quest/types/quest.types";
import { getQuests } from "../../../../graphql/subgraph/getQuests";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import getProfile from "../../../../graphql/lens/queries/profile";
import { getQuestById } from "../../../../graphql/subgraph/getQuest";
import { getPlayerJoined } from "../../../../graphql/subgraph/getPlayerJoined";
import {
  getCompletedMilestones,
  getCompletedQuest,
} from "../../../../graphql/subgraph/getCompleted";
import { getMetricsAdded } from "../../../../graphql/subgraph/getMetricsAdded";
import { Dispatch } from "redux";
import { setActivityFeed } from "../../../../redux/reducers/activityFeedSlice";
import fetchIPFSJSON from "../../../../lib/helpers/fetchIPFSJSON";

const useActivity = (
  lensConnected: Profile | undefined,
  activityFeed: (Quest & {
    type: string;
    profile: Profile | undefined;
  })[],
  dispatch: Dispatch
) => {
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
    publications: Record<string, any>;
  }>({
    profiles: {},
    publications: {},
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
        publications: {} as Record<string, any>,
      };

      const questPromises = questData?.data?.questInstantiateds?.map(
        async (item: any) => {
          let publication: Post,
            postId = `${toHexWithLeadingZero(
              Number(item?.profileId)
            )}-${toHexWithLeadingZero(Number(item?.pubId))}`;

          if (!cache.publications[postId]) {
            const data = await getPublication(
              {
                forId: postId,
              },
              lensConnected?.id
            );
            cache.publications[postId] = data?.data?.publication;
          }
          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          publication = cache.publications[postId];

          return {
            ...item,
            publication,
          };
        }
      );

      const playerPromises = newPlayerData?.data?.playerJoinedQuests?.map(
        async (item: any) => {
          let quest: Quest;

          if (!cache.quests[item?.questId]) {
            const data = await getQuestById(item?.questId);
            quest = data?.data?.questInstantiateds;
            cache.quests[item?.questId] = data?.data?.questInstantiateds;
          }

          quest = cache.quests[item?.questId];

          let profile: Profile,
            profileId = `${toHexWithLeadingZero(
              Number(item?.playerProfileId)
            )}`;

          if (!cache.profiles[profileId]) {
            const data = await getProfile(
              {
                forProfileId: profileId,
              },
              lensConnected?.id
            );
            cache.profiles[profileId] = data?.data?.profile;
          }
          profile = cache.profiles[profileId];

          let publication: Post,
            postId = `${toHexWithLeadingZero(
              Number(quest?.profileId)
            )}-${toHexWithLeadingZero(Number(quest?.pubId))}`;

          if (!cache.publications[postId]) {
            const data = await getPublication(
              {
                forId: postId,
              },
              lensConnected?.id
            );
            cache.publications[postId] = data?.data?.publication;
          }
          publication = cache.publications[postId];

          return {
            ...item,
            ...quest,
            profile,
            publication,
          };
        }
      );

      const milestoneCompletedPromises =
        milestoneData?.data?.milestoneCompleteds?.map(async (item: any) => {
          let profile: Profile,
            profileId = `${toHexWithLeadingZero(
              Number(item?.playerProfileId)
            )}`;

          if (!cache.profiles[profileId]) {
            const data = await getProfile(
              {
                forProfileId: profileId,
              },
              lensConnected?.id
            );
            cache.profiles[profileId] = data?.data?.profile;
          }

          profile = cache.profiles[profileId];

          let quest: Quest;

          if (!cache.quests[item?.questId]) {
            const data = await getQuestById(item?.questId);
            quest = data?.data?.questInstantiateds;
            cache.quests[item?.questId] = data?.data?.questInstantiateds;
          }

          quest = cache.quests[item?.questId];

          let publication: Post,
            postId = `${toHexWithLeadingZero(
              Number(quest?.profileId)
            )}-${toHexWithLeadingZero(Number(quest?.pubId))}`;

          if (!cache.publications[postId]) {
            const data = await getPublication(
              {
                forId: postId,
              },
              lensConnected?.id
            );
            cache.publications[postId] = data?.data?.publication;
          }
          publication = cache.publications[postId];

          return {
            ...item,
            ...quest,
            profile,
            publication,
          };
        });

      const completedPromises = completionData?.data?.questCompleteds?.map(
        async (item: any) => {
          let profile: Profile,
            profileId = `${toHexWithLeadingZero(
              Number(item?.playerProfileId)
            )}`;

          if (!cache.profiles[profileId]) {
            const data = await getProfile(
              {
                forProfileId: profileId,
              },
              lensConnected?.id
            );
            cache.profiles[profileId] = data?.data?.profile;
          }

          profile = cache.profiles[profileId];

          let quest: Quest;

          if (!cache.quests[item?.questId]) {
            const data = await getQuestById(item?.questId);
            quest = data?.data?.questInstantiateds;
            cache.quests[item?.questId] = data?.data?.questInstantiateds;
          }

          quest = cache.quests[item?.questId];

          let publication: Post,
            postId = `${toHexWithLeadingZero(
              Number(quest?.profileId)
            )}-${toHexWithLeadingZero(Number(quest?.pubId))}`;

          if (!cache.publications[postId]) {
            const data = await getPublication(
              {
                forId: postId,
              },
              lensConnected?.id
            );
            cache.publications[postId] = data?.data?.publication;
          }
          publication = cache.publications[postId];

          return {
            ...item,
            ...quest,
            profile,
            publication,
          };
        }
      );

      const metricsPromises = metricsData?.data?.playerMetricsUpdateds?.map(
        async (item: any) => {
          let profile: Profile,
            profileId = `${toHexWithLeadingZero(
              Number(item?.playerProfileId)
            )}`;

          if (!cache.profiles[profileId]) {
            const data = await getProfile(
              {
                forProfileId: profileId,
              },
              lensConnected?.id
            );
            cache.profiles[profileId] = data?.data?.profile;
          }

          profile = cache.profiles[profileId];

          let publication: Post,
            postId = `${toHexWithLeadingZero(
              Number(item?.videoProfileId)
            )}-${toHexWithLeadingZero(Number(item?.videoPubId))}`;

          if (!cache.publications[postId]) {
            const data = await getPublication(
              {
                forId: postId,
              },
              lensConnected?.id
            );
            cache.publications[postId] = data?.data?.publication;
          }
          publication = cache.publications[postId];

          return {
            ...item,
            profile,
            publication: publication,
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
        type: "milestone",
      }));
      const newCompleted = (await Promise.all(completedPromises))?.map(
        (item) => ({
          ...item,
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
      dispatch(
        setActivityFeed(
          [
            ...allQuests,
            ...newPlayers,
            ...newMilestones,
            ...newCompleted,
            ...newMetrics,
          ]?.sort((a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp))
        )
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
        publications: allCacheState?.publications,
      };

      const questPromises = (questData?.data?.questInstantiateds || [])?.map(
        async (item: any) => {
          let publication: Post,
            postId = `${toHexWithLeadingZero(
              Number(item?.profileId)
            )}-${toHexWithLeadingZero(Number(item?.pubId))}`;

          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          if (!cache.publications[postId]) {
            const data = await getPublication(
              {
                forId: postId,
              },
              lensConnected?.id
            );
            cache.publications[postId] = data?.data?.publication;
          }
          publication = cache.publications[postId];

          return {
            ...item,
            publication,
          };
        }
      );

      const playerPromises = (
        newPlayerData?.data?.playerJoinedQuests || []
      )?.map(async (item: any) => {
        let quest: Quest;

        if (!cache.quests[item?.questId]) {
          const data = await getQuestById(item?.questId);
          quest = data?.data?.questInstantiateds;
          cache.quests[item?.questId] = data?.data?.questInstantiateds;
        }

        quest = cache.quests[item?.questId];

        let profile: Profile,
          profileId = `${toHexWithLeadingZero(Number(item?.playerProfileId))}`;

        if (!cache.profiles[profileId]) {
          const data = await getProfile(
            {
              forProfileId: profileId,
            },
            lensConnected?.id
          );
          cache.profiles[profileId] = data?.data?.profile;
        }
        profile = cache.profiles[profileId];

        let publication: Post,
          postId = `${toHexWithLeadingZero(
            Number(quest?.profileId)
          )}-${toHexWithLeadingZero(Number(quest?.pubId))}`;

        if (!cache.publications[postId]) {
          const data = await getPublication(
            {
              forId: postId,
            },
            lensConnected?.id
          );
          cache.publications[postId] = data?.data?.publication;
        }
        publication = cache.publications[postId];

        return {
          ...item,
          ...quest,
          profile,
          publication,
        };
      });

      const milestoneCompletedPromises = (
        milestoneData?.data?.milestoneCompleteds || []
      )?.map(async (item: any) => {
        let profile: Profile,
          profileId = `${toHexWithLeadingZero(Number(item?.playerProfileId))}`;

        if (!cache.profiles[profileId]) {
          const data = await getProfile(
            {
              forProfileId: profileId,
            },
            lensConnected?.id
          );
          cache.profiles[profileId] = data?.data?.profile;
        }

        profile = cache.profiles[profileId];

        let quest: Quest;

        if (!cache.quests[item?.questId]) {
          const data = await getQuestById(item?.questId);
          quest = data?.data?.questInstantiateds;
          cache.quests[item?.questId] = data?.data?.questInstantiateds;
        }

        quest = cache.quests[item?.questId];

        let publication: Post,
          postId = `${toHexWithLeadingZero(
            Number(quest?.profileId)
          )}-${toHexWithLeadingZero(Number(quest?.pubId))}`;

        if (!cache.publications[postId]) {
          const data = await getPublication(
            {
              forId: postId,
            },
            lensConnected?.id
          );
          cache.publications[postId] = data?.data?.publication;
        }
        publication = cache.publications[postId];

        return {
          ...item,
          ...quest,
          profile,
          publication,
          milestone: item?.milestone,
        };
      });

      const completedPromises = (
        completionData?.data?.questCompleteds || []
      )?.map(async (item: any) => {
        let profile: Profile,
          profileId = `${toHexWithLeadingZero(Number(item?.playerProfileId))}`;

        if (!cache.profiles[profileId]) {
          const data = await getProfile(
            {
              forProfileId: profileId,
            },
            lensConnected?.id
          );
          cache.profiles[profileId] = data?.data?.profile;
        }

        profile = cache.profiles[profileId];
        let quest: Quest;

        if (!cache.quests[item?.questId]) {
          const data = await getQuestById(item?.questId);
          quest = data?.data?.questInstantiateds;
          cache.quests[item?.questId] = data?.data?.questInstantiateds;
        }

        quest = cache.quests[item?.questId];

        let publication: Post,
          postId = `${toHexWithLeadingZero(
            Number(quest?.profileId)
          )}-${toHexWithLeadingZero(Number(quest?.pubId))}`;

        if (!cache.publications[postId]) {
          const data = await getPublication(
            {
              forId: postId,
            },
            lensConnected?.id
          );
          cache.publications[postId] = data?.data?.publication;
        }
        publication = cache.publications[postId];

        return {
          ...item,
          ...quest,
          profile,
          publication,
        };
      });

      const metricsPromises = (
        metricsData?.data?.playerMetricsUpdateds || []
      )?.map(async (item: any) => {
        let profile: Profile,
          profileId = `${toHexWithLeadingZero(Number(item?.playerProfileId))}`;

        if (!cache.profiles[profileId]) {
          const data = await getProfile(
            {
              forProfileId: profileId,
            },
            lensConnected?.id
          );
          cache.profiles[profileId] = data?.data?.profile;
        }

        profile = cache.profiles[profileId];

        let publication: Post,
          postId = `${toHexWithLeadingZero(
            Number(item?.videoProfileId)
          )}-${toHexWithLeadingZero(Number(item?.videoPubId))}`;

        if (!cache.publications[postId]) {
          const data = await getPublication(
            {
              forId: postId,
            },
            lensConnected?.id
          );
          cache.publications[postId] = data?.data?.publication;
        }
        publication = cache.publications[postId];

        return {
          ...item,
          profile,
          publication: publication,
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
        type: "milestone",
      }));
      const newCompleted = (await Promise.all(completedPromises))?.map(
        (item) => ({
          ...item,
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

      dispatch(
        setActivityFeed([
          ...(activityFeed || []),
          ...[
            ...allQuests,
            ...newPlayers,
            ...newMilestones,
            ...newCompleted,
            ...newMetrics,
          ]?.sort(
            (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
          ),
        ])
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (activityFeed?.length < 1) {
      getActivityFeed();
    }
  }, [lensConnected]);

  return {
    activityLoading,
    getMoreActivityFeed,
    activityInfo,
  };
};

export default useActivity;
