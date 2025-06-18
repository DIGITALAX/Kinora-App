import { useContext, useEffect, useMemo, useState } from "react";
import { Quest, Video, VideoActivity } from "../../Common/types/common.types";
import { KINORA_METRICS, KINORA_QUEST_DATA } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { getVideoActivity } from "../../../../../graphql/getVideoActivity";
import { fetchPost, fetchPostReferences } from "@lens-protocol/client/actions";
import { PostReferenceType } from "@lens-protocol/client";
import { Kinora } from "kinora-sdk";
import { ethers } from "ethers";
import { Dispatch } from "kinora-sdk";

const useVideos = (
  dict: any,
  getQuestInfo: () => Promise<void>,
  kinoraDispatch: Dispatch,
  videoInfo?: VideoActivity | undefined,
  questInfo?: Quest | undefined,
  mainViewer?: number
) => {
  const context = useContext(ModalContext);
  const [videoPlaying, setVideoPlaying] = useState<Video | undefined>(
    undefined
  );
  const [milestoneEligible, setMilestoneEligible] = useState<boolean>(false);
  const [currentMetricsLoading, setCurrentMetricsLoading] =
    useState<boolean>(false);
  const [chainMetrics, setChainMetrics] = useState<VideoActivity | undefined>();
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [playerMetricsLive, setPlayerMetricsLive] = useState<
    VideoActivity | undefined
  >();
  const kinora = Kinora.getInstance(context?.lensConectado?.apollo as any);

  const handleSendMetrics = async () => {
    setMetricsLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        232
      );
      const signer = provider.getSigner();

      const { error, errorMessage } = await kinora.sendPlayerMetricsOnChain(
        (videoInfo ? videoInfo : videoPlaying)?.post?.id!,
        context?.lensConectado?.profile?.address,
        signer as any,
        KINORA_METRICS,
        KINORA_QUEST_DATA
      );

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.error);
      } else {
        context?.setSuccess({
          image: "QmWJsCA7cDet9d95TF7SqCwL2yXRQrTwPr897yhsipuaNF",
          text: "Metrics stored on chain! You're one step closer to completing this Milestone.",
        });
        await getQuestInfo();
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMetricsLoading(false);
  };

  const checkMilestoneToClaim = async () => {
    try {
      const { error, eligible } =
        await kinoraDispatch.playerMilestoneEligibilityCheck(
          context?.lensConectado?.profile?.address,
          Number(questInfo?.questId),
          Number(questInfo?.milestones[mainViewer! - 1]?.milestoneId),
          KINORA_QUEST_DATA
        );

      if (!error) {
        setMilestoneEligible(eligible!);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleCurrentMetrics = async () => {
    if (!videoPlaying?.post?.id && !videoInfo?.post?.id) {
      setPlayerMetricsLive(undefined);
      return;
    }
    setCurrentMetricsLoading(true);
    const chainMetrics = videoInfo ? videoInfo : await getVideoDetails();

    try {
      let currentActivity = {};
      if (!chainMetrics?.hasCommented && context?.lensConectado?.profile) {
        const res = await fetchPostReferences(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            referenceTypes: [PostReferenceType.CommentOn],
            referencedPost: (videoInfo ? videoInfo : videoPlaying)?.post?.id,
          }
        );
        if (res?.isOk()) {
          currentActivity = {
            ...currentActivity,
            hasCommented: res?.value?.items?.length > 0 ? true : false,
          };
        }
      }

      if (!chainMetrics?.hasQuoted) {
        currentActivity = {
          ...currentActivity,
          hasQuoted: (videoInfo ? videoInfo : videoPlaying)?.post?.operations
            ?.hasQuoted?.optimistic,
        };
      }

      if (!chainMetrics?.hasMirrored) {
        currentActivity = {
          ...currentActivity,
          hasMirrored: (videoInfo ? videoInfo : videoPlaying)?.post?.operations
            ?.hasReposted?.optimistic,
        };
      }

      if (!chainMetrics?.hasBookmarked) {
        currentActivity = {
          ...currentActivity,
          hasBookmarked: (videoInfo ? videoInfo : videoPlaying)?.post
            ?.operations?.hasBookmarked,
        };
      }

      if (!chainMetrics?.hasReacted) {
        currentActivity = {
          ...currentActivity,
          hasReacted: (videoInfo ? videoInfo : videoPlaying)?.post?.operations
            ?.hasUpvoted,
        };
      }

      if (context?.lensConectado?.profile) {
        const {
          secondaryQuoteOnQuote,
          secondaryMirrorOnQuote,
          secondaryReactOnQuote,
          secondaryCommentOnQuote,
          secondaryCollectOnQuote,
          secondaryQuoteOnComment,
          secondaryMirrorOnComment,
          secondaryReactOnComment,
          secondaryCommentOnComment,
          secondaryCollectOnComment,
        } = await kinora.getPlayerVideoSecondaryData(
          context?.lensConectado?.profile?.address,
          videoInfo ? videoInfo?.post?.id! : videoPlaying?.post?.id!
        );

        if (
          !chainMetrics?.secondaryQuoteOnQuote ||
          Number(chainMetrics?.secondaryQuoteOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryQuoteOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryMirrorOnQuote ||
          Number(chainMetrics?.secondaryMirrorOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryMirrorOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryReactOnQuote ||
          Number(chainMetrics?.secondaryReactOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryReactOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryCommentOnQuote ||
          Number(chainMetrics?.secondaryCommentOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCommentOnQuote,
          };
        }

        if (
          !chainMetrics?.secondaryCollectOnQuote ||
          Number(chainMetrics?.secondaryCollectOnQuote) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCollectOnQuote,
          };
        }
        if (
          !chainMetrics?.secondaryQuoteOnComment ||
          Number(chainMetrics?.secondaryQuoteOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryQuoteOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryMirrorOnComment ||
          Number(chainMetrics?.secondaryMirrorOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryMirrorOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryReactOnComment ||
          Number(chainMetrics?.secondaryReactOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryReactOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryCommentOnComment ||
          Number(chainMetrics?.secondaryCommentOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCommentOnComment,
          };
        }
        if (
          !chainMetrics?.secondaryCollectOnComment ||
          Number(chainMetrics?.secondaryCollectOnComment) == 0
        ) {
          currentActivity = {
            ...currentActivity,
            secondaryCollectOnComment,
          };
        }
      }

      setPlayerMetricsLive(currentActivity as VideoActivity);
    } catch (err: any) {
      console.error(err.message);
    }
    setCurrentMetricsLoading(false);
  };

  const getVideoDetails = async (): Promise<VideoActivity | undefined> => {
    if (!context?.lensConectado?.profile) return;
    try {
      let post;
      const data = await fetchPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post: videoPlaying?.post?.id,
        }
      );

      if (data?.isOk()) {
        post = data?.value;
      }
      const video = await getVideoActivity(
        context?.lensConectado?.profile?.address,
        videoPlaying?.post?.id!
      );
      setChainMetrics({
        ...video?.data?.videoActivities[0],
        avd: Number(video?.data?.videoActivities[0]?.avd)
          ? Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18
          : 0,
        duration: Number(video?.data?.videoActivities[0]?.duration)
          ? Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18
          : 0,
        post,
      });
      return {
        ...video?.data?.videoActivities[0],
        avd:
          video?.data?.videoActivities[0]?.avd &&
          Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18,
        duration:
          video?.data?.videoActivities[0]?.duration &&
          Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18,
        post,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getLogs = () => {
    const logs = kinora.getLiveVideoMetrics(
      videoInfo ? videoInfo?.post?.id! : videoPlaying?.post?.id!
    );

    const newMetrics = {
      ...(playerMetricsLive || {}),
      avd: logs.avd,
      duration: logs.duration,
      playCount: logs.playCount,
      totalInteractions: logs.totalInteractions,
    };

    setPlayerMetricsLive((prev) => {
      const isSame =
        prev?.avd === newMetrics.avd &&
        prev?.duration === newMetrics.duration &&
        prev?.playCount === newMetrics.playCount &&
        (prev as any)?.totalInteractions === newMetrics.totalInteractions;
      return isSame ? prev : (newMetrics as VideoActivity);
    });
  };

  useEffect(() => {
    if ((videoPlaying || videoInfo) && context?.clienteLens) {
      handleCurrentMetrics();
    }
  }, [
    videoPlaying || videoInfo,
    context?.lensConectado?.profile,
    context?.clienteLens,
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        (videoPlaying?.post?.id || videoInfo?.post?.id) &&
        playerMetricsLive !== undefined
      ) {
        getLogs();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoPlaying?.post?.id, videoInfo?.post?.id, playerMetricsLive]);

  useEffect(() => {
    if (
      !videoInfo &&
      questInfo?.questId &&
      mainViewer &&
      context?.lensConectado?.profile
    ) {
      checkMilestoneToClaim();
    }
  }, [questInfo?.questId, mainViewer, context?.lensConectado?.profile]);

  return {
    videoPlaying,
    setVideoPlaying,
    metricsLoading,
    handleSendMetrics,
    playerMetricsLive,
    currentMetricsLoading,
    chainMetrics,
    milestoneEligible,
  };
};

export default useVideos;
