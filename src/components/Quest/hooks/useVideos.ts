import { useEffect, useState } from "react";
import { Video, VideoActivity } from "../types/quest.types";
import { Profile } from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import { Kinora } from "kinora-sdk";
import { Dispatch } from "redux";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { ethers } from "ethers";

const useVideos = (
  chainMetrics: VideoActivity | undefined,
  lensConnected: Profile | undefined,
  dispatch: Dispatch
) => {
  const [videoPlaying, setVideoPlaying] = useState<Video | undefined>(
    undefined
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [seek, setSeek] = useState<number>(0);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [playerMetricsLive, setPlayerMetricsLive] = useState<
    VideoActivity | undefined
  >();
  const kinora = Kinora.getInstance();

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
        videoPlaying?.publication?.id,
        lensConnected?.id,
        signer as unknown as ethers.Wallet
      );

      if (error) {
        console.error(errorMessage);
        dispatch(setInteractError(true));
      } else {
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setMetricsLoading(true);
  };

  const handleCurrentMetrics = async () => {
    if (!videoPlaying?.publication?.id) {
      setPlayerMetricsLive(undefined);
      return;
    }
    try {
      let currentActivity = {};
      if (!chainMetrics?.hasCommented) {
        const { data } = await getPublications(
          {
            where: {
              commentOn: {
                id: videoPlaying?.publication?.id,
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
          hasQuoted: videoPlaying?.publication?.operations?.hasQuoted,
        };
      }

      if (!chainMetrics?.hasMirrored) {
        currentActivity = {
          ...currentActivity,
          hasMirrored: videoPlaying?.publication?.operations?.hasMirrored,
        };
      }

      if (!chainMetrics?.hasBookmarked) {
        currentActivity = {
          ...currentActivity,
          hasBookmarked: videoPlaying?.publication?.operations?.hasBookmarked,
        };
      }

      if (!chainMetrics?.hasReacted) {
        currentActivity = {
          ...currentActivity,
          hasReacted: videoPlaying?.publication?.operations?.hasReacted,
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
        videoPlaying?.publication?.id
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
  };

  const getLogs = () => {
    const logs = kinora.getLiveVideoMetrics(videoPlaying?.publication?.id);

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
    if (videoPlaying) {
      setSeek(0);
      handleCurrentMetrics();
    }
  }, [videoPlaying]);

  useEffect(() => {
    if (videoPlaying?.publication?.id && playerMetricsLive !== undefined) {
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
  };
};

export default useVideos;
