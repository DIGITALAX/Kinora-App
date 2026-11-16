import { FunctionComponent, JSX, useCallback, useRef } from "react";
import { NativeVideoProps } from "../types/common.types";
import getVideoSrc from "@/app/lib/helpers/getVideoSrc";

const NativeVideo: FunctionComponent<NativeVideoProps> = ({
  setMediaElement,
  src,
  muted,
  loop,
  autoPlay,
  styles,
}): JSX.Element => {
  const nodeRef = useRef<HTMLVideoElement | null>(null);
  const setterRef = useRef<(node: HTMLVideoElement) => void>(setMediaElement);
  setterRef.current = setMediaElement;

  const handleRef = useCallback((node: HTMLVideoElement | null) => {
    if (!node || node === nodeRef.current) return;
    nodeRef.current = node;
    setterRef.current(node);
  }, []);

  return (
    <video
      ref={handleRef}
      src={getVideoSrc(src)}
      muted={muted}
      loop={loop}
      autoPlay={autoPlay}
      playsInline
      preload="metadata"
      draggable={false}
      style={{
        objectFit: "cover",
        ...styles,
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export default NativeVideo;
