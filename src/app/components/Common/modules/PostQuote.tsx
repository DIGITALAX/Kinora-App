import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import moment from "moment";
import InteractBar from "./InteractBar";
import { Post } from "@lens-protocol/client";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { PostQuoteProps } from "../types/common.types";
import { useRouter } from "next/navigation";
import PostSwitch from "./PostSwitch";
import { ModalContext } from "@/app/providers";

const PostQuote: FunctionComponent<PostQuoteProps> = ({
  quote,
  disabled,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div
      className={`relative w-full overflow-y-hidden flex flex-col gap-3 items-start justify-center rounded-sm ${
        disabled ? "h-52" : "h-fit"
      }`}
      id={disabled ? "fadedQuote" : undefined}
    >
      <div
        className={`relative rounded-sm w-full h-full p-px flex items-center justify-start`}
        id="northern"
      >
        <div className="relative w-full h-full p-2 flex items-center justify-start flex-col gap-5 bg-nave">
          <div className="relative w-full h-fit flex flex-row items-center justify-between sm:justify-center gap-2 px-1 sm:flex-nowrap flex-wrap">
            <div className="relative w-fit h-fit flex items-center justify-center gap-2 mr-auto">
              <div
                className="relative w-5 h-5 flex items-center justify-center p-px rounded-full cursor-pointer"
                onClick={() => {
                  context?.setRouterChangeLoading(true);
                  router.push(`/envoke/${quote?.author?.username?.localName}`);
                }}
                id="northern"
              >
                <div className="relative flex items-center justify-center rounded-full w-full h-full">
                  <Image
                    layout="fill"
                    src={handleProfilePicture(quote?.author?.metadata?.picture)}
                    draggable={false}
                    className="rounded-full"
                    objectFit="cover"
                  />
                </div>
              </div>
              <div
                className={`relative w-fit h-fit text-xs flex items-center justify-center text-white font-bit top-px`}
              >
                {Number(quote?.author?.username?.localName.length) > 25
                  ? quote?.author?.username?.localName.substring(0, 20) + "..."
                  : quote?.author?.username?.localName}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div
                className={`relative w-fit h-fit text-gray-400 font-bit items-center justify-center flex text-xxs ml-auto top-px`}
              >
                {moment(`${quote?.timestamp}`).fromNow()}
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex items-start justify-center">
            <PostSwitch item={quote} disabled={disabled} />
          </div>
          <InteractBar post={quote as Post} dict={dict} mainFeed={false} />
        </div>
      </div>
    </div>
  );
};

export default PostQuote;
