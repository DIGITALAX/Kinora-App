import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import PostComment from "../../Common/modules/PostComment";
import useComment from "../../Common/hooks/useComment";
import PostQuote from "../../Common/modules/PostQuote";

const QuoteBox: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  const {
    searchProfiles,
    setProfilesOpen,
    profilesFound,
    profilesOpen,
    commentLoading,
    setCommentDetails,
    commentDetails,
    textElement,
    caretCoord,
    comment,
  } = useComment();

  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-start justify-center">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                context?.setQuote({
                  open: false,
                })
              }
            />
          </div>
          <PostQuote
            quote={context?.quote?.post!}
            disabled={true}
            dict={dict}
          />
          <div className="relative w-full h-full flex items-center justify-center pb-3">
            <div className="relative h-full w-4/5 items-center justify-center flex">
              <PostComment
                dict={dict}
                commentDetails={commentDetails}
                searchProfiles={searchProfiles}
                caretCoord={caretCoord}
                comment={comment}
                commentLoading={commentLoading}
                textElement={textElement}
                setCommentDetails={setCommentDetails}
                profilesOpen={profilesOpen}
                mentionProfiles={profilesFound}
                setProfilesOpen={setProfilesOpen}
                id={context?.quote?.post?.id!}
                height="25vh"
                imageHeight="1.5rem"
                imageWidth="1.5rem"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBox;
