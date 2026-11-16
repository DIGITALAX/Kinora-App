import { GROVE_GATEWAY, INFURA_GATEWAY, IPFS_REGEX } from "../constants";

const getVideoSrc = (uri: string | undefined | null): string => {
  if (!uri) return "";
  const cleaned = uri.trim();

  if (cleaned.includes("ipfs://")) {
    return `${INFURA_GATEWAY}/ipfs/${cleaned
      .split("ipfs://")[1]
      .replace(/^ipfs\//, "")}`;
  }

  if (cleaned.includes("lens://")) {
    return `${GROVE_GATEWAY}${cleaned.split("lens://")[1]}`;
  }

  if (cleaned.includes("ar://")) {
    return `https://arweave.net/${cleaned
      .split("ar://")[1]
      .replace(/"/g, "")
      .trim()}`;
  }

  if (!cleaned.includes(":") && IPFS_REGEX.test(cleaned)) {
    return `${INFURA_GATEWAY}/ipfs/${cleaned}`;
  }

  return cleaned;
};

export default getVideoSrc;
