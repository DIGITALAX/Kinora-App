import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { RootState } from "../../../redux/store";
import { NextRouter } from "next/router";
import useJoin from "@/components/Quest/hooks/useJoin";
import useInteractions from "@/components/Quest/hooks/useInteractions";
import { useAccount } from "wagmi";

export default function QuestId({ router }: { router: NextRouter }) {
  const { questId } = router.query;
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const { questInfoLoading, questInfo, setQuestInfo } = useJoin(
    questId as string
  );
  const {
    mirror,
    like,
    comment,
    followProfile,
    unfollowProfile,
    handleHidePost,
    interactionsItemsLoading,
    mainInteractionsLoading,
    allCommentsLoading,
    setMakeComment,
    handleMoreComments,
    commentInfo,
    openMoreOptions,
    commentsOpen,
    profilesOpenMain,
    setProfilesOpenMain,
  } = useInteractions(
    lensConnected,
    questId as string,
    dispatch,
    address,
    publicClient,
    postCollectGif,
    setQuestInfo
  );
  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      ></div>
    </div>
  );
}
