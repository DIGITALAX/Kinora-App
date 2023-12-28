import { INFURA_GATEWAY } from "../constants";

export const convertIPFS = async (
  ipfsHash: string,
  fileName: string = "video.mp4"
): Promise<File> => {
  const response = await fetch(`${INFURA_GATEWAY}/ipfs/${ipfsHash}`);
  return new File([await response.blob()], fileName, { type: "video/mp4" });
};
