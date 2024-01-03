import { useState } from "react";
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

  // log metrics on chain

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
  };
};

export default useVideos;
