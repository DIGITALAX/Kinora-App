import { ethers } from "ethers";
import { UnknownOpenActionModuleInput } from "../../graphql/generated";
import { COINOP_OPEN_ACTION } from "../constants";

const encodeActData = (
  chosenIndexes: number[],
  chosenAmounts: number[],
  encryptedFulfillment: string,
  currency: `0x${string}`
): UnknownOpenActionModuleInput | undefined => {
  return {
    address: COINOP_OPEN_ACTION,
    data: ethers.utils.defaultAbiCoder.encode(
      ["uint256[]", "uint256[]", "string", "address", "bool"],
      [chosenIndexes, chosenAmounts, encryptedFulfillment, currency, false]
    ),
  };
};

export default encodeActData;
