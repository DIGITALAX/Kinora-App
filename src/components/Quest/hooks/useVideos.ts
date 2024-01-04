import { useEffect, useState } from "react";
import { Video, VideoActivity } from "../types/quest.types";
import { Profile } from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";

const useVideos = (
  chainMetrics: VideoActivity | undefined,
  lensConnected: Profile | undefined
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

  const handleSendMetrics = () => {
    setMetricsLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setMetricsLoading(true);
  };

  const handleCurrentMetrics = async () => {
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

      setPlayerMetricsLive(currentActivity as VideoActivity);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (videoPlaying) {
      setSeek(0);
      handleCurrentMetrics();
    }
  }, [videoPlaying]);

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
