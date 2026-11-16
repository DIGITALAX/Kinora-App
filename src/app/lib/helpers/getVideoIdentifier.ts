import { IPFS_REGEX } from "../constants";

const getVideoIdentifier = (uri: string | undefined | null): string => {
  if (!uri) return "";
  const cleaned = uri.trim();

  if (cleaned.includes("ipfs://")) {
    return cleaned
      .split("ipfs://")[1]
      .replace(/^ipfs\//, "")
      .split(/[/?#]/)[0];
  }

  const cid = cleaned.match(IPFS_REGEX);
  if (cid) {
    return cid[0];
  }

  if (cleaned.includes("lens://")) {
    return cleaned.split("lens://")[1].split(/[/?#]/)[0];
  }

  if (cleaned.includes("ar://")) {
    return cleaned
      .split("ar://")[1]
      .replace(/"/g, "")
      .trim()
      .split(/[/?#]/)[0];
  }

  return cleaned;
};

export default getVideoIdentifier;
