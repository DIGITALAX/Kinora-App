import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { Quest, VideoActivity } from "../../Common/types/common.types";
import { getVideoPlayerId, getVideos } from "../../../../../graphql/getVideos";
import { getQuestById } from "../../../../../graphql/getQuest";
import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import { SocialType } from "../types/video.types";
import { fetchPost } from "@lens-protocol/client/actions";
import { getVideoActivity } from "../../../../../graphql/getVideoActivity";

const useVideo = (videoId: string) => {
  const context = useContext(ModalContext);
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
      const videos = await getVideos(10, 0, videoId);

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
          let publication;
          const res = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: data?.data?.questInstantiateds?.[0]?.postId,
            }
          );

          if (res?.isOk()) {
            publication = res?.value;
          }

          return {
            ...data?.data?.questInstantiateds?.[0],
            post: publication,
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
      const videos = await getVideos(10, videoInfo?.cursor, videoId);

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
          let publication;
          const res = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: data?.data?.questInstantiateds?.[0]?.postId,
            }
          );

          if (res?.isOk()) {
            publication = res?.value;
          }

          return {
            ...data?.data?.questInstantiateds?.[0],
            post: publication,
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
      let publication;
      const data = await fetchPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post: videoId,
        }
      );

      if (data?.isOk()) {
        publication = data?.value;
      }

      const video = await getVideoActivity(
        context?.lensConectado?.profile?.address,
        videoId
      );
      const activityData = await getVideoPlayerId(videoId);

      let videoDataObject;

      if (video?.data?.videoActivities?.length < 1) {
        videoDataObject = {
          playerId: activityData?.data?.videos?.[0]?.playerId,
          postId: activityData?.data?.videos?.[0]?.postId,
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
                (item) => item?.postId === videoId
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

      setVideoData({
        ...videoDataObject,
        details,
        post: publication,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoDataLoading(false);
  };

  useEffect(() => {
    if (!videoData && videoId && context?.clienteLens) {
      getVideoDetails();
    }
  }, [context?.clienteLens, videoId, context?.lensConectado?.sessionClient]);

  useEffect(() => {
    if (videoId && relatedQuests?.length < 1 && context?.clienteLens) {
      getRelatedQuests();
    }
  }, [videoId, context?.clienteLens, context?.lensConectado?.sessionClient]);
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
  };
};

export default useVideo;
