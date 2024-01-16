import { INFURA_GATEWAY, IPFS_REGEX } from "../constants";

const getVideoCover = async (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    videoUrl = buildCover(videoUrl);

    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    let isLoaded = false;

    video.addEventListener("loadeddata", () => {
      if (!isLoaded) {
        isLoaded = true;
        captureFrame();
      }
    });

    video.addEventListener("error", () => {
      if (!isLoaded) {
        reject(`Error loading video ${videoUrl}`);
      }
    });

    const captureFrame = () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL());
      }
    };

    setTimeout(() => {
      if (!isLoaded) {
        video.currentTime = 1.0;
      }
    }, 10000);
  });
};

export default getVideoCover;

export const buildCover = (videoUrl: string): string => {
  if (
    videoUrl?.includes("ipfs://") &&
    IPFS_REGEX.test(videoUrl?.split("ipfs://")?.[1])
  ) {
    videoUrl = `${INFURA_GATEWAY}/ipfs/${videoUrl?.split("ipfs://")[1]}`;
  } else if (videoUrl?.includes("ar://")) {
    videoUrl = `https://arweave.net/${videoUrl
      ?.split("ar://")?.[1]
      ?.replace(/"/g, "")
      ?.trim()}`;
  } else if (videoUrl?.includes("https://")) {
    videoUrl = videoUrl;
  }

  return videoUrl;
};
