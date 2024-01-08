import { useEffect, useState } from "react";
import { Quest, Video, VideoActivity } from "../types/quest.types";
import { Profile } from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import { Kinora } from "kinora-sdk";
import { Dispatch } from "redux";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { ethers } from "ethers";
import { setSuccess } from "../../../../redux/reducers/successSlice";
import { apolloClient } from "../../../../lib/lens/client";

const useVideos = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  getQuestInfo: () => Promise<void>,
  questInfo?: Quest | undefined,
  videoInfo?: VideoActivity | undefined
) => {
  const [videoPlaying, setVideoPlaying] = useState<Video | undefined>(
    undefined
  );
  const [currentMetricsLoading, setCurrentMetricsLoading] =
    useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [seek, setSeek] = useState<number>(0);
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

  const handleCurrentMetrics = async () => {
    if (!videoPlaying?.publication?.id && !videoInfo?.publication?.id) {
      setPlayerMetricsLive(undefined);
      return;
    }
    setCurrentMetricsLoading(true);

    const chainMetrics = videoInfo
      ? videoInfo
      : questInfo?.players
          ?.find(
            (player) =>
              Number(player?.profileId) == parseInt(lensConnected?.id, 16)
          )
          ?.videos?.find(
            (video) =>
              Number(video?.pubId) ==
              Number((videoInfo ? videoInfo : videoPlaying)?.pubId)
          );

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

      const {
        error,
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

      if (!error) {
        currentActivity = {
          ...currentActivity,
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
        };
      }
      setPlayerMetricsLive(currentActivity as VideoActivity);
    } catch (err: any) {
      console.error(err.message);
    }
    setCurrentMetricsLoading(false);
  };

  const getLogs = () => {
    const logs = kinora.getLiveVideoMetrics(
      videoInfo ? videoInfo?.publication?.id : videoPlaying?.publication?.id
    );

    setPlayerMetricsLive({
      ...(playerMetricsLive || {}),
      avd: logs.avd,
      totalDuration: logs.duration,
      playCount: logs.playCount,
      mostReplayed: logs.mostReplayedArea,
      totalInteractions: logs.totalInteractions,
    } as VideoActivity);
  };

  useEffect(() => {
    if (videoPlaying || videoInfo) {
      setSeek(0);
      handleCurrentMetrics();
    }
  }, [videoPlaying || videoInfo]);

  useEffect(() => {
    if (
      (videoPlaying?.publication?.id || videoInfo?.publication?.id) &&
      playerMetricsLive !== undefined
    ) {
      getLogs();
    }
  });

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
  };
};

export default useVideos;
