import { useEffect, useState } from "react";
import { Video } from "../types/quest.types";
import { Kinora } from "kinora-sdk";

const useVideos = (videos: Video[]) => {
  const [videoPlaying, setVideoPlaying] = useState<Video | undefined>(
    undefined
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [seek, setSeek] = useState<number>(0);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [metricsLoading, setMetricsLoading] = useState<boolean>(false);

  const handleSendMetrics = () => {
    setMetricsLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setMetricsLoading(true);
  };

  useEffect(() => {
    if (videoPlaying) {
      setSeek(0);
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
    handleSendMetrics
  };
};

export default useVideos;
