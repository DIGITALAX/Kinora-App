import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import moment from "moment";
import PostSwitch from "./PostSwitch";
import { PostQuoteProps } from "../types/common.types";
import InteractBar from "./InteractBar";

const PostQuote: FunctionComponent<PostQuoteProps> = ({
  quote,
  dispatch,
  disabled,
  router,
}): JSX.Element => {
  const profilePicture = createProfilePicture(quote?.by?.metadata?.picture);
  return (
    <div
      className={`relative w-full overflow-y-hidden flex items-start justify-center rounded-sm ${
        disabled ? "h-52" : "h-fit"
      }`}
      id={disabled ? "fadedQuote" : undefined}
    >
      <div
        className={`relative rounded-sm w-full h-full p-px flex items-center justify-start`}
        id="rainbow"
      >
        <div className="relative w-full h-full p-2 flex items-center justify-start flex-col gap-5 bg-nave">
          <div className="relative w-full h-fit flex flex-row items-center justify-center gap-2 px-1">
            <div className="relative w-fit h-fit flex items-center justify-center gap-2 mr-auto">
              <div
                className="relative w-5 h-5 flex items-center justify-center p-px rounded-full cursor-pointer"
                onClick={() =>
                  router.push(
                    `/envoke/${
                      quote?.by?.handle?.suggestedFormatted?.localName?.split(
                        "@"
                      )?.[1]
                    }`
                  )
                }
                id="rainbow"
              >
                <div className="relative flex items-center justify-center rounded-full w-full h-full">
                  {profilePicture && (
                    <Image
                      layout="fill"
                      src={profilePicture}
                      draggable={false}
                      className="rounded-full"
                      objectFit="cover"
                    />
                  )}
                </div>
              </div>
              <div
                className={`relative w-fit h-fit text-xs flex items-center justify-center text-white font-bit top-px`}
              >
                {quote?.by?.handle?.suggestedFormatted?.localName
                  ? quote?.by?.handle?.suggestedFormatted?.localName.length > 25
                    ? quote?.by?.handle?.suggestedFormatted?.localName.substring(
                        0,
                        20
                      ) + "..."
                    : quote?.by?.handle?.suggestedFormatted?.localName
                  : ""}
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div
                className={`relative w-fit h-fit text-gray-400 font-bit items-center justify-center flex text-xxs ml-auto top-px`}
              >
                {quote?.createdAt && moment(`${quote?.createdAt}`).fromNow()}
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex items-start justify-center">
            <PostSwitch item={quote} dispatch={dispatch} disabled={disabled} />
          </div>
          <InteractBar />
        </div>
      </div>
    </div>
  );
};

export default PostQuote;
