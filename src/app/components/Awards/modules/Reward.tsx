import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import { RewardProps } from "../types/rewards.types";

const Reward: FunctionComponent<RewardProps> = ({
  reward,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit sm:h-80 border border-cost rounded-sm p-2 flex">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0">
        <Image
          layout="fill"
          objectFit="cover"
          draggable={false}
          src={`${INFURA_GATEWAY}/ipfs/${
            reward?.questMetadata?.cover?.split("ipfs://")?.[1]
          }`}
        />
      </div>
      <div className="bg-black relative w-full h-full rounded-sm p-2 flex items-start justify-start flex-col gap-5">
        <div className="relative w-full h-fit flex items-start justify-between flex flex-row flex-wrap gap-2">
          <div className="relative w-fit h-fit flex items-center justify-start text-white font-bit text-xs break-words">
            {reward?.questMetadata?.title?.length > 15
              ? reward?.questMetadata?.title?.slice(0, 10) + "..."
              : reward?.questMetadata?.title}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center gap-1.5 flex-row">
            <div className="relative w-fit h-fit flex items-center justify-center text-cost font-bit text-xs break-words">
              {`${dict?.mil} ${reward.milestone}`}
            </div>
            <div
              className="relative w-fit h-fit flex items-center justify-center cursor-pointer"
              onClick={() => {
                context?.setRouterChangeLoading(true);
                router.push(`/quest/${reward?.postId}`);
              }}
            >
              <div className="relative w-4 h-4 flex items-end justify-end">
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                  draggable={false}
                  layout="fill"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-px bg-gray-700"></div>
        <div className="relative flex flex-col sm:flex-row gap-2 justify-start sm:justify-between items-center sm:items-start w-full h-full">
          <div
            className="relative w-full h-60 sm:h-full flex rounded-sm items-center justify-center border border-suave cursor-pointer active:scale-95"
            id="northern"
            onClick={() =>
              context?.setImageViewer({
                type: "png",
                image: `${INFURA_GATEWAY}/ipfs/${
                  reward?.rewardMetadata?.images?.[0]?.split("ipfs://")?.[1]
                }`,
              })
            }
          >
            <Image
              className="rounded-sm"
              draggable={false}
              layout="fill"
              objectFit="cover"
              src={`${INFURA_GATEWAY}/ipfs/${
                reward?.rewardMetadata?.images?.[0]?.split("ipfs://")?.[1]
              }`}
            />
          </div>
          <div className="relative w-full h-fit flex items-end justify-start gap-2 flex-col font-vcr overflow-y-scroll">
            <div className="relative w-fit h-fit flex flex-col gap-1 items-end justify-end">
              <div className="relative text-xs text-girasol flex items-center justify-center w-fit h-fit">
                {dict?.tit}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center w-fit h-fit text-xxs text-white">
                {reward?.rewardMetadata?.title}
              </div>
            </div>
            <div className="relative w-fit h-fit flex flex-col gap-1 items-end justify-end">
              <div className="relative text-xs text-girasol flex items-center justify-center w-fit h-fit">
                {dict?.des}
              </div>
              <div className="relative w-fit h-fit flex items-start justify-end text-right w-fit h-fit text-xxs text-white max-h-[10rem] overflow-y-scroll">
                {reward?.rewardMetadata?.description}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reward;
