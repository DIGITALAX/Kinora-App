import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import getPublication from "../../../../graphql/lens/queries/publication";
import {
  Quest,
  SocialType,
  VideoActivity,
} from "@/components/Quest/types/quest.types";
import { getQuestById } from "../../../../graphql/subgraph/getQuest";
import {
  getVideoPlayerId,
  getVideos,
} from "../../../../graphql/subgraph/getVideos";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import { getVideoActivity } from "../../../../graphql/subgraph/getVideoActivity";
import fetchIPFSJSON from "../../../../lib/helpers/fetchIPFSJSON";

const useVideo = (videoId: string, lensConnected: Profile | undefined) => {
  const [videoDataLoading, setVideoDataLoading] = useState<boolean>(false);
  const [relatedQuestsLoading, setRelatedQuestsLoading] =
    useState<boolean>(false);
  const [videoData, setVideoData] = useState<VideoActivity | undefined>();
  const [socialType, setSocialType] = useState<SocialType>(SocialType.Players);
  const [relatedQuests, setRelatedQuests] = useState<Quest[]>([]);
  const [videoInfo, setVideoInfo] = useState<{
    hasMore: boolean;
    cursor: number;
  }>({
    hasMore: true,
    cursor: 0,
  });

  const getRelatedQuests = async () => {
    if (!videoId) return;
    setRelatedQuestsLoading(true);
    try {
      const videos = await getVideos(
        10,
        0,
        parseInt(videoId?.split("-")?.[1], 16),
        parseInt(videoId?.split("-")?.[0], 16)
      );

      const videoPromises = videos?.data?.videos
        .filter(
          (v: { questId: string }, i: number, arr: { questId: string }[]) =>
            arr.findIndex(
              (t: { questId: string }) => t.questId === v.questId
            ) === i
        )
        ?.map(async (video: { questId: string }) => {
          const data = await getQuestById(video?.questId);

          if (
            data?.data?.questInstantiateds?.[0] &&
            !data?.data?.questInstantiateds?.[0]?.questMetadata
          ) {
            const fetched = await fetchIPFSJSON(
              data?.data?.questInstantiateds?.[0]?.uri
            );
            data.data.questInstantiateds[0] = {
              ...data?.data?.questInstantiateds?.[0],
              questMetadata: fetched,
            };
          }
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(data?.data?.questInstantiateds?.[0]?.profileId)
              )}-${toHexWithLeadingZero(
                Number(data?.data?.questInstantiateds?.[0]?.pubId)
              )}`,
            },
            lensConnected?.id
          );

          return {
            ...data?.data?.questInstantiateds?.[0],
            publication: publication?.data?.publication,
          };
        });

      const allQuests = await Promise.all(videoPromises);

      setRelatedQuests(allQuests);
      setVideoInfo({
        hasMore: allQuests?.length == 10 ? true : false,
        cursor: allQuests?.length == 10 ? 10 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setRelatedQuestsLoading(false);
  };

  const getMoreRelatedQuests = async () => {
    try {
      const videos = await getVideos(
        10,
        videoInfo?.cursor,
        parseInt(videoId?.split("-")?.[1], 16),
        parseInt(videoId?.split("-")?.[0], 16)
      );

      const videoPromises = videos?.data?.videos
        ?.filter(
          (v: { questId: string }, i: number, arr: { questId: string }[]) =>
            arr.findIndex(
              (t: { questId: string }) => t.questId === v.questId
            ) === i
        )
        ?.map(async (video: { questId: string }) => {
          const data = await getQuestById(video?.questId);

          if (
            data?.data?.questInstantiateds?.[0] &&
            !data?.data?.questInstantiateds?.[0]?.questMetadata
          ) {
            const fetched = await fetchIPFSJSON(
              data?.data?.questInstantiateds?.[0]?.uri
            );
            data.data.questInstantiateds[0] = {
              ...data?.data?.questInstantiateds?.[0],
              questMetadata: fetched,
            };
          }

          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(data?.data?.questInstantiateds?.[0]?.profileId)
              )}-${toHexWithLeadingZero(
                Number(data?.data?.questInstantiateds?.[0]?.pubId)
              )}`,
            },
            lensConnected?.id
          );

          return {
            ...data?.data?.questInstantiateds?.[0],
            publication: publication?.data?.publication,
          };
        });

      const allQuests = await Promise.all(videoPromises);

      setRelatedQuests(allQuests);

      setVideoInfo({
        hasMore: allQuests?.length == 10 ? true : false,
        cursor: allQuests?.length == 10 ? videoInfo?.cursor + 10 : 0,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getVideoDetails = async () => {
    if (!videoId) return;
    setVideoDataLoading(true);
    try {
      const data = await getPublication(
        {
          forId: videoId,
        },
        lensConnected?.id
      );
      const video = await getVideoActivity(
        parseInt(lensConnected?.id, 16),
        parseInt(videoId?.split("-")?.[1], 16),
        parseInt(videoId?.split("-")?.[0], 16)
      );

      let videoDataObject;

      if (video?.data?.videoActivities?.length < 1) {
        const data = await getVideoPlayerId(
          parseInt(videoId?.split("-")?.[1], 16),
          parseInt(videoId?.split("-")?.[0], 16)
        );
        videoDataObject = {
          playerId: data?.data?.videos?.[0]?.playerId,
          pubId: data?.data?.videos?.[0]?.pubId,
          profileId: data?.data?.videos?.[0]?.profileId,
        };
      } else {
        videoDataObject = {
          ...video?.data?.videoActivities[0],
          avd:
            video?.data?.videoActivities[0]?.avd &&
            Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18,
          duration:
            video?.data?.videoActivities[0]?.duration &&
            Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18,
        };
      }

      setVideoData({
        ...videoDataObject,
        publication: data?.data?.publication,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoDataLoading(false);
  };

  useEffect(() => {
    if (!videoData && videoId && lensConnected?.id) {
      getVideoDetails();
    }
  }, [lensConnected?.id, videoId]);

  useEffect(() => {
    if (videoId && relatedQuests?.length < 1) {
      getRelatedQuests();
    }
  }, [videoId]);
  return {
    videoDataLoading,
    videoData,
    socialType,
    setSocialType,
    relatedQuests,
    relatedQuestsLoading,
    getMoreRelatedQuests,
    videoInfo,
    getVideoDetails,
    setVideoData,
    setRelatedQuests,
  };
};

export default useVideo;
