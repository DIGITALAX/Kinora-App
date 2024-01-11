import { FunctionComponent } from "react";
import Sidebar from "./Sidebar";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Index from "./Indexer";
import InteractError from "./InteractError";
import FollowCollect from "./FollowCollect";
import useFollowCollect from "../hooks/useFollowCollect";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import QuoteBox from "./QuoteBox";
import useQuote from "../hooks/useQuote";
import ImageLarge from "./ImageLarge";
import Success from "./Success";
import PostCollectGif from "./PostCollectGif";
import QuestGates from "./QuestGates";
import Followers from "./Followers";
import useFollowers from "../hooks/useFollowers";
import useNewQuests from "../hooks/useNewQuests";
import ClaimProfile from "./ClaimProfile";
import MissingValues from "./MissingValues";

const Modals: FunctionComponent<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const questGates = useSelector(
    (state: RootState) => state.app.questGatesReducer
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const quote = useSelector((state: RootState) => state.app.quoteReducer);
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const image = useSelector((state: RootState) => state.app.imageViewerReducer);
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer.currencies
  );
  const followBox = useSelector(
    (state: RootState) => state.app.followBoxReducer
  );
  const success = useSelector((state: RootState) => state.app.successReducer);
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const followCollect = useSelector(
    (state: RootState) => state.app.followCollectReducer
  );
  const allUploaded = useSelector(
    (state: RootState) => state.app.allUploadedReducer.videos
  );
  const claimProfile = useSelector(
    (state: RootState) => state.app.claimProfileReducer
  );
  const missingValues = useSelector(
    (state: RootState) => state.app.missingValuesReducer
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const indexer = useSelector((state: RootState) => state.app.indexerReducer);
  const interactError = useSelector(
    (state: RootState) => state.app.interactErrorReducer
  );
  const { handleLogIn } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address,
    allUploaded,
    oracleData
  );
  const {
    handleCollect,
    handleFollow,
    approveSpend,
    approved,
    transactionLoading,
    informationLoading,
  } = useFollowCollect(
    dispatch,
    followCollect,
    publicClient,
    address,
    availableCurrencies,
    lensConnected
  );
  const { followData, hasMore, showMore, dataLoading } = useFollowers(
    followBox,
    lensConnected
  );
  const {
    setMakeQuote,
    setCaretCoord,
    setMentionProfiles,
    setProfilesOpen,
    profilesOpen,
    mentionProfiles,
    caretCoord,
    makeQuote,
    quoteLoading,
    setContentLoading,
    contentLoading,
    handleQuote,
    openMeasure,
    setOpenMeasure,
    collects,
    setCollects,
    handleGif,
    searchGifLoading,
    gifInfo,
    setGifInfo,
  } = useQuote(postCollectGif, publicClient, address, dispatch, quote);
  const { newQuests } = useNewQuests();
  return (
    <>
      <Sidebar
        newQuests={newQuests}
        router={router}
        openSidebar={openSidebar}
        lensConnected={lensConnected}
        dispatch={dispatch}
        walletConnected={walletConnected}
        handleLogIn={handleLogIn}
        openConnectModal={openConnectModal}
      />
      {followCollect?.type && (
        <FollowCollect
          dispatch={dispatch}
          type={followCollect?.type!}
          collect={followCollect?.collect}
          follower={followCollect?.follower}
          handleCollect={handleCollect}
          handleFollow={handleFollow}
          informationLoading={informationLoading}
          transactionLoading={transactionLoading}
          approved={approved}
          approveSpend={approveSpend}
        />
      )}
      {followBox?.open && (
        <Followers
          hasMore={hasMore}
          showMore={showMore}
          dataLoading={dataLoading}
          dispatch={dispatch}
          router={router}
          followers={followData}
        />
      )}
      {quote?.open && (
        <QuoteBox
          lensConnected={lensConnected}
          setCaretCoord={setCaretCoord}
          setMentionProfiles={setMentionProfiles}
          setProfilesOpen={setProfilesOpen}
          profilesOpen={profilesOpen}
          mentionProfiles={mentionProfiles}
          caretCoord={caretCoord}
          dispatch={dispatch}
          router={router}
          quote={quote?.publication!}
          makeQuote={makeQuote}
          setMakeQuote={setMakeQuote}
          quoteLoading={quoteLoading}
          postCollectGif={postCollectGif}
          handleQuote={handleQuote}
          contentLoading={contentLoading}
          setContentLoading={setContentLoading}
        />
      )}
      {image?.value && (
        <ImageLarge
          dispatch={dispatch}
          mainImage={image.image}
          type={image.type}
        />
      )}
      {questGates?.gates && (
        <QuestGates gates={questGates?.gates} dispatch={dispatch} />
      )}
      {postCollectGif?.type && (
        <PostCollectGif
          dispatch={dispatch}
          gifInfo={gifInfo}
          setGifInfo={setGifInfo}
          openMeasure={openMeasure}
          setOpenMeasure={setOpenMeasure}
          availableCurrencies={availableCurrencies}
          collects={collects}
          setCollects={setCollects}
          type={postCollectGif?.type}
          id={postCollectGif?.id!}
          collectTypes={postCollectGif?.collectTypes}
          handleGif={handleGif}
          gifs={postCollectGif?.gifs}
          searchGifLoading={searchGifLoading}
        />
      )}
      {missingValues?.value && <MissingValues dispatch={dispatch} />}
      {claimProfile?.value && <ClaimProfile dispatch={dispatch} />}
      {indexer?.open && <Index message={indexer?.message!} />}
      {interactError?.value && <InteractError dispatch={dispatch} />}
      {success?.value?.open && (
        <Success
          image={success?.value?.image!}
          dispatch={dispatch}
          text={success?.value?.text!}
        />
      )}
    </>
  );
};

export default Modals;
