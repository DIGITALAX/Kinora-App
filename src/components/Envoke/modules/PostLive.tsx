import { FunctionComponent } from "react";
import { PostLiveProps } from "../types/envoke.types";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS_MUMBAI,
  INFURA_GATEWAY,
} from "../../../../lib/constants";

const PostLive: FunctionComponent<PostLiveProps> = ({
  postLoading,
  handlePostLive,
  tokensToApprove,
  handleApprove,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-center justify-start flex-col text-sm font-bit text-white gap-8">
      <div className="relative w-fit hit flex items-center justify-center text-center break-words">
        Only one step left. <br /> <br /> Ready to post your Quest live?
      </div>
      {tokensToApprove?.filter((item) => !item.approved)?.length > 0 && (
        <div className="relative w-full h-fit flex items-center justify-center flex-col gap-3">
          <div className="relative w-fit h-fit flex items-center justify-center text-xs">
            Approve You Reward Tokens.
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
                      className="relative w-fit h-fit flex flex-col gap-1.5 items-center justify-center"
                    >
                      <div className="relative flex w-fit h-fit items-center justify-center text-white font-bit text-xs">
                        {`${
                          ACCEPTED_TOKENS_MUMBAI?.find(
                            (value) =>
                              value[2]?.toLowerCase() ===
                              item?.address?.toLowerCase()
                          )?.[1]
                        }`}{" "}
                        {Number(item?.amount) / 10 ** 18}
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

      <div
        className={`relative w-32 bg-black h-8 p-1 rounded-md border border-white hover:opacity-80 flex items-center justify-center ${
          tokensToApprove?.filter((item) => !item.approved)?.length > 0
            ? "opacity-70"
            : "cursor-pointer active:scale-95"
        }`}
        onClick={() =>
          tokensToApprove?.filter((item) => !item.approved)?.length == 0 &&
          !postLoading &&
          handlePostLive()
        }
      >
        <div
          className={`${
            postLoading ? "animate-spin" : "top-px"
          } flex items-center justify-center `}
        >
          {postLoading ? (
            <AiOutlineLoading color="white" size={15} />
          ) : (
            "Post Quest"
          )}
        </div>
      </div>
    </div>
  );
};

export default PostLive;
