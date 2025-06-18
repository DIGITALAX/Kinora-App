import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { Reward } from "../../Common/types/common.types";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { RewardProps } from "../types/quest.types";

const Rewards: FunctionComponent<RewardProps> = ({ rewards }): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-fit h-fit justify-start items-center gap-4 flex flex-row flex-wrap">
      {rewards?.flat()?.map((reward: Reward, index: number) => {
        return (
          <div
            key={index}
            className="relative w-fit h-fit flex items-center justify-center gap-1"
          >
            {reward?.type === "0" ? (
              <>
                <div className="relative w-5 h-6 flex items-center justify-center">
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${
                      ACCEPTED_TOKENS?.filter(
                        (token) =>
                          reward?.tokenAddress?.toLowerCase() ==
                          token[2]?.toLowerCase()
                      )?.[0]?.[0]
                    }`}
                  />
                </div>
                <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-acei text-xxs">
                  {`${Number(reward?.amount) / 10 ** 18} ${
                    ACCEPTED_TOKENS?.filter(
                      (token) =>
                        reward?.tokenAddress?.toLowerCase() ==
                        token[2]?.toLowerCase()
                    )?.[0]?.[1]
                  }`}
                </div>
              </>
            ) : (
              <div
                className="relative w-10 h-10 flex items-center justify-center gap-1 rounded-sm p-px"
                id="northern"
              >
                <div
                  className="relative w-full h-full flex items-center justify-center rounded-sm cursor-pointer active:scale-95"
                  onClick={() =>
                    context?.setImageViewer({
                      type: "png",
                      image: `${INFURA_GATEWAY}/ipfs/${
                        reward?.rewardMetadata?.mediaCover &&
                        reward?.rewardMetadata?.mediaCover !== ""
                          ? reward?.rewardMetadata?.mediaCover?.split(
                              "ipfs://"
                            )?.[1]
                          : reward?.rewardMetadata?.images?.[0]?.split(
                              "ipfs://"
                            )?.[1]
                      }`,
                    })
                  }
                >
                  <Image
                    draggable={false}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-sm"
                    src={`${INFURA_GATEWAY}/ipfs/${
                      reward?.rewardMetadata?.mediaCover &&
                      reward?.rewardMetadata?.mediaCover !== ""
                        ? reward?.rewardMetadata?.mediaCover?.split(
                            "ipfs://"
                          )?.[1]
                        : reward?.rewardMetadata?.images?.[0]?.split(
                            "ipfs://"
                          )?.[1]
                    }`}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Rewards;
