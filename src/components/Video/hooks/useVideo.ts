import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import getPublication from "../../../../graphql/lens/queries/publication";
import {
  Quest,
  SocialType,
  VideoActivity,
} from "@/components/Quest/types/quest.types";
import { getQuestById } from "../../../../graphql/subgraph/getQuest";
import { getVideos } from "../../../../graphql/subgraph/getVideos";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import { getVideoActivity } from "../../../../graphql/subgraph/getVideoActivity";

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

  const getRelatedQuests = async (id: string) => {
    setRelatedQuestsLoading(true);
    try {
      const videos = await getVideos(
        10,
        0,
        parseInt(videoId?.split("-")?.[1], 16),
        parseInt(videoId?.split("-")?.[0], 16)
      );

      const videoPromises = videos?.data?.videos?.map(
        async (video: { questId: string }) => {
          const data = await getQuestById(video?.questId);
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
            publication: publication?.data,
          };
        }
      );

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

      const videoPromises = videos?.data?.videos?.map(
        async (video: { questId: string }) => {
          const data = await getQuestById(video?.questId);
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
            publication: publication?.data,
          };
        }
      );

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

      setVideoData({
        ...video?.data?.videoActivities[0],
        avd:
          video?.data?.videoActivities[0]?.avd &&
          Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18,
        duration:
          video?.data?.videoActivities[0]?.duration &&
          Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18,
        publication: data?.data?.publication,
      });
      await getRelatedQuests(data?.data?.publication?.id);
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
