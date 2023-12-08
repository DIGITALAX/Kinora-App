import { PublicationMetadata } from "../../graphql/generated";
import { INFURA_GATEWAY, IPFS_REGEX } from "../constants";

const createMedia = (
  metadata: PublicationMetadata
):
  | {
      cover: string;
      video: string;
    }
  | undefined => {
  let cover: string | undefined;
  let video: string | undefined;

  if (metadata?.__typename !== "VideoMetadataV3") {
    return undefined;
  }

  if (metadata?.asset?.cover?.raw?.uri) {
    if (
      metadata?.asset?.cover?.raw?.uri?.includes("ipfs://") &&
      IPFS_REGEX.test(metadata?.asset?.cover?.raw?.uri?.split("ipfs://")?.[1])
    ) {
      cover = `${INFURA_GATEWAY}/ipfs/${
        metadata?.asset?.cover?.raw?.uri?.split("ipfs://")[1]
      }`;
    } else if (metadata?.asset?.cover?.raw?.uri?.includes("ar://")) {
      cover = `https://arweave.net/${metadata?.asset?.cover?.raw?.uri
        ?.split("ar://")?.[1]
        ?.replace(/"/g, "")
        ?.trim()}`;
    }
  } else if (metadata?.asset?.cover?.optimized?.uri) {
    if (
      metadata?.asset?.cover?.optimized?.uri?.includes("ipfs://") &&
      IPFS_REGEX.test(
        metadata?.asset?.cover?.optimized?.uri?.split("ipfs://")?.[1]
      )
    ) {
      cover = `${INFURA_GATEWAY}/ipfs/${
        metadata?.asset?.cover?.optimized?.uri?.split("ipfs://")[1]
      }`;
    } else if (metadata?.asset?.cover?.optimized?.uri?.includes("ar://")) {
      cover = `https://arweave.net/${metadata?.asset?.cover?.optimized?.uri
        ?.split("ar://")?.[1]
        ?.replace(/"/g, "")
        ?.trim()}`;
    } else {
      cover = metadata?.asset?.cover?.optimized?.uri;
    }
  }

  if (metadata?.asset?.video?.raw?.uri) {
    if (
      metadata?.asset?.video?.raw?.uri?.includes("ipfs://") &&
      IPFS_REGEX.test(metadata?.asset?.video?.raw?.uri?.split("ipfs://")?.[1])
    ) {
      video = `${INFURA_GATEWAY}/ipfs/${
        metadata?.asset?.video?.raw?.uri?.split("ipfs://")[1]
      }`;
    } else if (metadata?.asset?.video?.raw?.uri?.includes("ar://")) {
      video = `https://arweave.net/${metadata?.asset?.video?.raw?.uri
        ?.split("ar://")?.[1]
        ?.replace(/"/g, "")
        ?.trim()}`;
    }
  } else if (metadata?.asset?.video?.optimized?.uri) {
    if (
      metadata?.asset?.video?.optimized?.uri?.includes("ipfs://") &&
      IPFS_REGEX.test(
        metadata?.asset?.video?.optimized?.uri?.split("ipfs://")?.[1]
      )
    ) {
      video = `${INFURA_GATEWAY}/ipfs/${
        metadata?.asset?.video?.optimized?.uri?.split("ipfs://")[1]
      }`;
    } else if (metadata?.asset?.video?.optimized?.uri?.includes("ar://")) {
      video = `https://arweave.net/${metadata?.asset?.video?.optimized?.uri
        ?.split("ar://")?.[1]
        ?.replace(/"/g, "")
        ?.trim()}`;
    } else {
      video = metadata?.asset?.video?.optimized?.uri;
    }
  }

  return !video || !cover
    ? undefined
    : {
        cover,
        video,
      };
};

export default createMedia;
