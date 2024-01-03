import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { setQuote } from "../../../../redux/reducers/quoteSlice";
import PostComment from "@/components/Common/modules/PostComment";
import { QuoteBoxProps } from "../types/modals.types";
import PostQuote from "@/components/Common/modules/PostQuote";

const QuoteBox: FunctionComponent<QuoteBoxProps> = ({
  setMakeQuote,
  setCaretCoord,
  setMentionProfiles,
  setProfilesOpen,
  profilesOpen,
  mentionProfiles,
  caretCoord,
  makeQuote,
  quoteLoading,
  router,
  dispatch,
  quote,
  lensConnected,
  contentLoading,
  setContentLoading,
  postCollectGif,
  handleQuote,
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-start justify-center">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() =>
                dispatch(
                  setQuote({
                    actionOpen: false,
                  })
                )
              }
            />
          </div>
          <PostQuote
            router={router}
            dispatch={dispatch}
            quote={quote!}
            disabled={true}
            index={0}
          />
          <div className="relative w-full h-full flex items-center justify-center pb-3">
            <div className="relative h-full w-4/5 items-center justify-center flex">
              <PostComment
                setCaretCoord={setCaretCoord}
                caretCoord={caretCoord}
                profilesOpen={profilesOpen?.[0]}
                mentionProfiles={mentionProfiles}
                setMentionProfiles={setMentionProfiles}
                setProfilesOpen={setProfilesOpen}
                lensConnected={lensConnected}
                main={false}
                setMakePostComment={setMakeQuote}
                makePostComment={makeQuote[0]}
                commentPostLoading={quoteLoading[0]}
                commentPost={handleQuote}
                height="25vh"
                imageHeight="1.5rem"
                imageWidth="1.5rem"
                contentLoading={contentLoading[0]}
                index={0}
                setContentLoading={setContentLoading}
                dispatch={dispatch}
                postCollectGif={postCollectGif}
                id={quote?.id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteBox;
