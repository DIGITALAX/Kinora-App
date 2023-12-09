import { PublicationMetadata } from "../../graphql/generated";
import { INFURA_GATEWAY, IPFS_REGEX } from "../constants";

const createMedia = (metadata: PublicationMetadata): string | undefined => {
  let image: string | undefined;

  if (metadata?.__typename !== "ImageMetadataV3") {
    return undefined;
  }

  if (metadata?.asset?.image?.raw?.uri) {
    if (
      metadata?.asset?.image?.raw?.uri?.includes("ipfs://") &&
      IPFS_REGEX.test(metadata?.asset?.image?.raw?.uri?.split("ipfs://")?.[1])
    ) {
      image = `${INFURA_GATEWAY}/ipfs/${
        metadata?.asset?.image?.raw?.uri?.split("ipfs://")[1]
      }`;
    } else if (metadata?.asset?.image?.raw?.uri?.includes("ar://")) {
      image = `https://arweave.net/${metadata?.asset?.image?.raw?.uri
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
      image = `${INFURA_GATEWAY}/ipfs/${
        metadata?.asset?.image?.optimized?.uri?.split("ipfs://")[1]
      }`;
    } else if (metadata?.asset?.image?.optimized?.uri?.includes("ar://")) {
      image = `https://arweave.net/${metadata?.asset?.image?.optimized?.uri
        ?.split("ar://")?.[1]
        ?.replace(/"/g, "")
        ?.trim()}`;
    } else {
      image = metadata?.asset?.image?.optimized?.uri;
    }
  }

  return image;
};

export default createMedia;
