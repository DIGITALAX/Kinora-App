import { useState } from "react";
import { Video } from "../types/quest.types";
import { Kinora } from "kinora-sdk";

const useVideos = (videos: Video[]) => {
  const [videoPlaying, setVideoPlaying] = useState<Video | undefined>(
    undefined
  );

  // log metrics on chain

  return {
    videoPlaying,
    setVideoPlaying,
  };
};

export default useVideos;
