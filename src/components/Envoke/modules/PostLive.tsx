import { FunctionComponent } from "react";
import { PostLiveProps } from "../types/envoke.types";
import { AiOutlineLoading } from "react-icons/ai";

const PostLive: FunctionComponent<PostLiveProps> = ({
  postLoading,
  handlePostLive,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-center justify-start flex-col text-sm font-bit text-white gap-8">
      <div className="relative w-fit hit flex items-center justify-center text-center break-words">
        Only one step left. <br /> <br /> Ready to post your Quest live?
      </div>
      <div
        className="relative w-32 bg-black h-8 p-1 rounded-md border border-white cursor-pointer active:scale-95 hover:opacity-80 flex items-center justify-center"
        onClick={() => !postLoading && handlePostLive()}
      >
        <div
          className={`${
            postLoading ? "animate-spin" : "top-px"
          } flex items-center justify-center`}
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
