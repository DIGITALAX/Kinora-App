import { useState } from "react";

const useVideoControls = () => {
  const [openControls, setOpenControls] = useState<boolean>(true);
  const [playing, setPlaying] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.5);
  const [seek, setSeek] = useState<number>(0);
  const [volumeOpen, setVolumeOpen] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);

  return {
    openControls,
    setOpenControls,
    duration,
    setDuration,
    seek,
    setSeek,
    setVolumeOpen,
    volumeOpen,
    playing,
    setPlaying,
    volume,
    setVolume,
  };
};

export default useVideoControls;
