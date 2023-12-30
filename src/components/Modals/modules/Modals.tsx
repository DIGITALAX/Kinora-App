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
import { polygon, polygonMumbai } from "viem/chains";
import QuoteBox from "./QuoteBox";
import useQuote from "../hooks/useQuote";
import ImageLarge from "./ImageLarge";
import Success from "./Success";

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
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
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
    allUploaded
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
  } = useQuote(postCollectGif, publicClient, address, dispatch, quote);
  return (
    <>
      <Sidebar
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
      {indexer?.open && <Index message={indexer?.message!} />}
      {interactError?.value && <InteractError dispatch={dispatch} />}
      {success?.value && <Success dispatch={dispatch} />}
    </>
  );
};

export default Modals;
