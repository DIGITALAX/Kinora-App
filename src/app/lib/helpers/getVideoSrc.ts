import { GROVE_GATEWAY, INFURA_GATEWAY, IPFS_REGEX } from "../constants";

const getVideoSrc = (uri: string | undefined | null): string => {
  if (!uri) return "";
  const cleaned = uri.trim();

  if (cleaned.includes("ipfs://")) {
    const remainder = cleaned.split("ipfs://")[1].replace(/^ipfs\//, "");
    return remainder.includes("..")
      ? ""
      : `${INFURA_GATEWAY}/ipfs/${remainder}`;
  }

  if (cleaned.includes("lens://")) {
    const remainder = cleaned.split("lens://")[1];
    return remainder.includes("..") ? "" : `${GROVE_GATEWAY}${remainder}`;
  }

  if (cleaned.includes("ar://")) {
    const remainder = cleaned.split("ar://")[1].replace(/"/g, "").trim();
    return remainder.includes("..") ? "" : `https://arweave.net/${remainder}`;
  }

  if (!cleaned.includes(":") && IPFS_REGEX.test(cleaned)) {
    return cleaned.includes("..") ? "" : `${INFURA_GATEWAY}/ipfs/${cleaned}`;
  }

  if (cleaned.startsWith("data:video/") || cleaned.startsWith("blob:")) {
    return cleaned;
  }

  try {
    return new URL(cleaned).protocol === "https:" ? cleaned : "";
  } catch (err: any) {
    return "";
  }
};

export default getVideoSrc;
