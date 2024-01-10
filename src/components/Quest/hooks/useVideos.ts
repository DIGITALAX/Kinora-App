import { useEffect, useState } from "react";
import { Quest, Video, VideoActivity } from "../types/quest.types";
import { Profile } from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import { Dispatch } from "redux";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { ethers } from "ethers";
import { setSuccess } from "../../../../redux/reducers/successSlice";
import { apolloClient } from "../../../../lib/lens/client";
import { getVideoActivity } from "../../../../graphql/subgraph/getVideoActivity";
import getPublication from "../../../../graphql/lens/queries/publication";
import { Dispatch as KinoraDispatch, Kinora } from "kinora-sdk";

const useVideos = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  getQuestInfo: () => Promise<void>,
  kinoraDispatch: KinoraDispatch,
  videoInfo?: VideoActivity | undefined,
  questInfo?: Quest | undefined,
  mainViewer?: number
) => {
  const [videoPlaying, setVideoPlaying] = useState<Video | undefined>(
    undefined
  );
  const [milestoneEligible, setMilestoneEligible] = useState<boolean>(false);
  const [currentMetricsLoading, setCurrentMetricsLoading] =
    useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [seek, setSeek] = useState<number>(0);
  const [chainMetrics, setChainMetrics] = useState<VideoActivity | undefined>();
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [playerMetricsLive, setPlayerMetricsLive] = useState<
    VideoActivity | undefined
  >();
  const kinora = Kinora.getInstance(apolloClient);

  const handleSendMetrics = async () => {
    setMetricsLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        80001
      );
      const signer = provider.getSigner();

      const { error, errorMessage } = await kinora.sendPlayerMetricsOnChain(
        (videoInfo ? videoInfo : videoPlaying)?.publication?.id,
        lensConnected?.id,
        signer as unknown as ethers.Wallet
      );

      if (error) {
        console.error(errorMessage);
        dispatch(setInteractError(true));
      } else {
        dispatch(
          setSuccess({
            open: true,
            image: "QmWJsCA7cDet9d95TF7SqCwL2yXRQrTwPr897yhsipuaNF",
            text: "Metrics stored on chain! You're one step closer to completing this Milestone.",
          })
        );

        await getQuestInfo();
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMetricsLoading(false);
  };

  const checkMilestoneToClaim = async () => {
    try {
      const { error, eligible, completed, toComplete, errorMessage } =
        await kinoraDispatch.playerMilestoneEligibilityCheck(
          lensConnected?.id,
          Number(questInfo?.questId),
          Number(questInfo?.milestones[mainViewer! - 1]?.milestoneId)
        );

      if (!error) {
        setMilestoneEligible(eligible!);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleCurrentMetrics = async () => {
    if (!videoPlaying?.publication?.id && !videoInfo?.publication?.id) {
      setPlayerMetricsLive(undefined);
      return;
    }
    setCurrentMetricsLoading(true);
    const chainMetrics = videoInfo ? videoInfo : await getVideoDetails();

    try {
      let currentActivity = {};
      if (!chainMetrics?.hasCommented) {
        const { data } = await getPublications(
          {
            where: {
              commentOn: {
                id: (videoInfo ? videoInfo : videoPlaying)?.publication?.id,
              },
              from: [lensConnected?.id],
            },
          },
          lensConnected?.id
        );
        currentActivity = {
          ...currentActivity,
          hasCommented:
            data?.publications?.items && data?.publications?.items?.length > 0
              ? true
              : false,
        };
      }

      if (!chainMetrics?.hasQuoted) {
        currentActivity = {
          ...currentActivity,
          hasQuoted: (videoInfo ? videoInfo : videoPlaying)?.publication
            ?.operations?.hasQuoted,
        };
      }

      if (!chainMetrics?.hasMirrored) {
        currentActivity = {
          ...currentActivity,
          hasMirrored: (videoInfo ? videoInfo : videoPlaying)?.publication
            ?.operations?.hasMirrored,
        };
      }

      if (!chainMetrics?.hasBookmarked) {
        currentActivity = {
          ...currentActivity,
          hasBookmarked: (videoInfo ? videoInfo : videoPlaying)?.publication
            ?.operations?.hasBookmarked,
        };
      }

      if (!chainMetrics?.hasReacted) {
        currentActivity = {
          ...currentActivity,
          hasReacted: (videoInfo ? videoInfo : videoPlaying)?.publication
            ?.operations?.hasReacted,
        };
      }

      if (lensConnected?.id) {
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
          lensConnected?.id,
          videoInfo ? videoInfo?.publication?.id : videoPlaying?.publication?.id
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
    if (!lensConnected?.id) return;
    try {
      const data = await getPublication(
        {
          forId: videoPlaying?.publication?.id,
        },
        lensConnected?.id
      );
      const video = await getVideoActivity(
        parseInt(lensConnected?.id, 16),
        parseInt(videoPlaying?.publication?.id?.split("-")?.[1], 16),
        parseInt(videoPlaying?.publication?.id?.split("-")?.[0], 16)
      );
      setChainMetrics({
        ...video?.data?.videoActivities[0],
        avd: Number(video?.data?.videoActivities[0]?.avd)
          ? Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18
          : 0,
        duration: Number(video?.data?.videoActivities[0]?.duration)
          ? Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18
          : 0,
        publication: data?.data?.publication,
      });
      return {
        ...video?.data?.videoActivities[0],
        avd:
          video?.data?.videoActivities[0]?.avd &&
          Number(video?.data?.videoActivities[0]?.avd) / 10 ** 18,
        duration:
          video?.data?.videoActivities[0]?.duration &&
          Number(video?.data?.videoActivities[0]?.duration) / 10 ** 18,
        publication: data?.data?.publication,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getLogs = () => {
    const logs = kinora.getLiveVideoMetrics(
      videoInfo ? videoInfo?.publication?.id : videoPlaying?.publication?.id
    );

    setPlayerMetricsLive({
      ...(playerMetricsLive || {}),
      avd: logs.avd,
      duration: logs.duration,
      playCount: logs.playCount,
      totalInteractions: logs.totalInteractions,
    } as VideoActivity);
  };

  useEffect(() => {
    if (videoPlaying || videoInfo) {
      setSeek(0);
      handleCurrentMetrics();
      // drawEngagementGraph();
    }
  }, [videoPlaying || videoInfo, lensConnected?.id]);

  // const drawEngagementGraph = async () => {
  //   const videoElement = document
  //     ?.getElementById(
  //       (
  //         Number(videoPlaying?.pubId) + Number(videoPlaying?.profileId)
  //       ).toString()
  //     )
  //     ?.querySelector(".livepeer-aspect-ratio-container")
  //     ?.querySelector("video")!;
  //   const canvasElement = document.getElementById(
  //     "engagementGraph"
  //   ) as HTMLCanvasElement;
  //   if (!canvasElement || !videoElement) return;

  //   const data = await fetch(
  //     `${INFURA_GATEWAY}/ipfs/${
  //       playerMetricsLive?.mostReplayed?.split("ipfs://")?.[1]
  //     }`
  //   );

  //   let engagementData = await data.json();

  //   if (!engagementData) return;

  //   const ctx = canvasElement.getContext("2d");
  //   const width = canvasElement.width;
  //   const height = canvasElement.height;

  //   if (ctx) {
  //     // Clear the canvas
  //     ctx.clearRect(0, 0, width, height);

  //     // Prepare data for drawing
  //     const maxViews = Math.max(...Array.from(engagementData?.values()));
  //     const duration = videoElement.duration * 1000; // in milliseconds

  //     const scaleX = (time) => (time / duration) * width;
  //     const scaleY = (views) => (1 - views / maxViews) * height;

  //     // Begin drawing
  //     ctx.beginPath();
  //     ctx.moveTo(0, height); // start from bottom left

  //     for (let [time, views] of engagementData) {
  //       ctx.lineTo(scaleX(time), scaleY(views));
  //     }

  //     // Finish drawing
  //     ctx.lineTo(width, height); // end at bottom right
  //     ctx.closePath();
  //     ctx.fillStyle = "rgba(0, 123, 255, 0.5)"; // choose a color for the graph
  //     ctx.fill();
  //   }
  // };

  useEffect(() => {
    if (
      (videoPlaying?.publication?.id || videoInfo?.publication?.id) &&
      playerMetricsLive !== undefined
    ) {
      getLogs();
    }
  });

  useEffect(() => {
    if (!videoInfo && questInfo?.questId && mainViewer) {
      checkMilestoneToClaim();
    }
  }, [questInfo?.questId, mainViewer]);

  return {
    videoPlaying,
    setVideoPlaying,
    playing,
    setPlaying,
    volume,
    setVolume,
    seek,
    setSeek,
    volumeOpen,
    setVolumeOpen,
    duration,
    setDuration,
    metricsLoading,
    handleSendMetrics,
    playerMetricsLive,
    currentMetricsLoading,
    chainMetrics,
    milestoneEligible,
  };
};

export default useVideos;
