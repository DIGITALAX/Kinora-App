import { PublicationMetadata } from "../../graphql/generated";
import { INFURA_GATEWAY, IPFS_REGEX } from "../constants";

const createMedia = (
  metadata: PublicationMetadata
):
  | {
      asset: string | undefined;
      cover: string | undefined;
    }
  | undefined => {
  let asset: string | undefined;
  let cover: string | undefined;
  if (
    metadata?.__typename !== "ImageMetadataV3" &&
    metadata?.__typename !== "VideoMetadataV3"
  ) {
    return undefined;
  }

  if (metadata?.__typename === "ImageMetadataV3") {
    if (metadata?.asset?.image?.raw?.uri) {
      if (
        metadata?.asset?.image?.raw?.uri?.includes("ipfs://") &&
        IPFS_REGEX.test(metadata?.asset?.image?.raw?.uri?.split("ipfs://")?.[1])
      ) {
        asset = `${INFURA_GATEWAY}/ipfs/${
          metadata?.asset?.image?.raw?.uri?.split("ipfs://")[1]
        }`;
      } else if (metadata?.asset?.image?.raw?.uri?.includes("ar://")) {
        asset = `https://arweave.net/${metadata?.asset?.image?.raw?.uri
          ?.split("ar://")?.[1]
          ?.replace(/"/g, "")
          ?.trim()}`;
      }
    } else if (metadata?.asset?.image?.optimized?.uri) {
      if (
        metadata?.asset?.image?.optimized?.uri?.includes("ipfs://") &&
        IPFS_REGEX.test(
          metadata?.asset?.image?.optimized?.uri?.split("ipfs://")?.[1]
        )
      ) {
        asset = `${INFURA_GATEWAY}/ipfs/${
          metadata?.asset?.image?.optimized?.uri?.split("ipfs://")[1]
        }`;
      } else if (metadata?.asset?.image?.optimized?.uri?.includes("ar://")) {
        asset = `https://arweave.net/${metadata?.asset?.image?.optimized?.uri
          ?.split("ar://")?.[1]
          ?.replace(/"/g, "")
          ?.trim()}`;
      } else {
        asset = metadata?.asset?.image?.optimized?.uri;
      }
    }
  }

  if (metadata?.__typename === "VideoMetadataV3") {
    if (metadata?.asset?.video?.raw?.uri) {
      if (
        metadata?.asset?.video?.raw?.uri?.includes("ipfs://") &&
        IPFS_REGEX.test(metadata?.asset?.video?.raw?.uri?.split("ipfs://")?.[1])
      ) {
        asset = `${INFURA_GATEWAY}/ipfs/${
          metadata?.asset?.video?.raw?.uri?.split("ipfs://")[1]
        }`;
      } else if (metadata?.asset?.video?.raw?.uri?.includes("ar://")) {
        asset = `https://arweave.net/${metadata?.asset?.video?.raw?.uri
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
        asset = `${INFURA_GATEWAY}/ipfs/${
          metadata?.asset?.video?.optimized?.uri?.split("ipfs://")[1]
        }`;
      } else if (metadata?.asset?.video?.optimized?.uri?.includes("ar://")) {
        asset = `https://arweave.net/${metadata?.asset?.video?.optimized?.uri
          ?.split("ar://")?.[1]
          ?.replace(/"/g, "")
          ?.trim()}`;
      } else {
        asset = metadata?.asset?.video?.optimized?.uri;
      }
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
  }

  return {
    asset,
    cover,
  };
};

export default createMedia;
