import { INFURA_GATEWAY, IPFS_REGEX } from "../constants";

export const convertIPFS = async (
  link: string,
  fileName: string = "video.mp4"
): Promise<File | undefined> => {
  try {
    const response = await fetch(
      link?.includes("https://")
        ? link
        : `${INFURA_GATEWAY}/ipfs/${
            link?.includes("ipfs://") ? link?.split("ipfs://")?.[1] : link
          }`
    );

    if (!response.ok) {
      console.error(`Error fetching IPFS content: ${response.statusText}`);
    }
    return new File([await response.blob()], fileName, { type: "video/mp4" });
  } catch (err: any) {
    console.error(err.message);
  }
};
