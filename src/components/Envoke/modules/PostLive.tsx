import { FunctionComponent } from "react";
import { PostLiveProps } from "../types/envoke.types";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";

const PostLive: FunctionComponent<PostLiveProps> = ({
  tokensToApprove,
  handleApprove,
}): JSX.Element => {
  return (
    <div className="relative w-full h-full flex items-center justify-start flex-col bg-black  text-lg font-bit text-white gap-8 px-4 py-6">
      <div className="relative w-fit hit flex items-center justify-center text-center break-words leading-5">
        Just one step left. <br /> <br /> Are you ready for your <br /> <br />
        Quest to be live?
      </div>
      {tokensToApprove?.filter((item) => !item.approved)?.length > 0 && (
        <div className="relative w-full h-fit flex items-center justify-center flex-col gap-3">
          <div className="relative w-fit h-fit flex items-center justify-center text-xs">
            Approve Your Reward Tokens.
          </div>
          <div className="relative w-full h-fit flex items-center justify-center flex-row gap-3 flex-wrap">
            {tokensToApprove
              ?.filter((item) => !item.approved)
              ?.map(
                (
                  item: {
                    address: string;
                    amount: string;
                    approved: boolean;
                  },
                  index: number
                ) => {
                  return (
                    <div
                      key={index}
                      className="relative w-fit h-fit flex flex-col gap-2 items-center justify-center"
                    >
                      <div className="relative flex flex-col gap-1 w-fit h-fit items-center justify-center font-bit">
                        <div className="relative w-fit h-fit flex items-center justify-center text-xs text-white">{`${
                          ACCEPTED_TOKENS_MUMBAI?.find(
                            (value) =>
                              value[2]?.toLowerCase() ===
                              item?.address?.toLowerCase()
                          )?.[1]
                        }`}</div>
                        <div className="relative w-fit h-fit flex items-center justify-center text-xxs text-ligera">
                          {Number(item?.amount) / 10 ** 18}
                        </div>
                      </div>
                      <div
                        className="relative w-7 h-8 flex items-center justify-center rounded-full cursor-pointer hover:opacity-70 active:scale-95"
                        onClick={() =>
                          handleApprove(item?.address as `0x${string}`)
                        }
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${
                            ACCEPTED_TOKENS_MUMBAI?.find(
                              (value) =>
                                value[2]?.toLowerCase() ===
                                item?.address?.toLowerCase()
                            )?.[0]
                          }`}
                          className="flex rounded-full"
                          draggable={false}
                          layout="fill"
                        />
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostLive;
