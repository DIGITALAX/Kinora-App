import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import Head from "next/head";
import useCheckout from "@/components/Storefront/hooks/useCheckout";
import Prints from "@/components/Storefront/modules/Prints";
import Checkout from "@/components/Storefront/modules/Checkout";
import useInteractions from "@/components/Common/hooks/useInteractions";

export default function Storefront() {
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const allUploaded = useSelector(
    (state: RootState) => state.app.allUploadedReducer.videos
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const { handleLogIn, signLoading } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address,
    allUploaded,
    oracleData
  );
  const {
    storeLoading,
    storeItems,
    checkoutItem,
    checkoutLoading,
    fulfillmentDetails,
    setFulfillmentDetails,
    chosenCartItem,
    setChosenCartItem,
    checkoutCurrency,
    handleApproveSpend,
    approved,
    setCheckoutCurrency,
    setStoreItems,
  } = useCheckout(lensConnected, publicClient, oracleData, address, dispatch);
  const {
    mirror,
    like,
    interactionsLoading,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
  } = useInteractions(
    lensConnected,
    dispatch,
    storeItems,
    address,
    publicClient,
    setStoreItems
  );

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5 font-bit text-white"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <Head>
        <title>Storefront</title>
        <meta
          name="og:url"
          content={`https://kinora.irrevocable.dev/storefront`}
        />
        <meta name="og:title" content={"Storefront"} />
        <meta name="og:description" content={"Kinora IRL Print Collections."} />
        <meta
          name="og:image"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <meta
          name="twitter:url"
          content={`https://kinora.irrevocable.dev/storefront`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://kinora.irrevocable.dev/fonts/Bitblox.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="https://kinora.irrevocable.dev/fonts/Vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <div
        className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div className="relative w-fit h-fit flex items-start justify-start text-2xl pb-10">
          Kinora Shop
        </div>
        <div className="relative w-full h-full flex items-start justify-start flex-row text-xs gap-4">
          <Prints
            setStoreItems={setStoreItems}
            lensConnected={lensConnected}
            mirror={mirror}
            like={like}
            dispatch={dispatch}
            storeLoading={storeLoading}
            storeItems={storeItems}
            interactionsLoading={interactionsLoading}
            mirrorChoiceOpen={mirrorChoiceOpen}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            chosenCartItem={chosenCartItem}
            setChosenCartItem={setChosenCartItem}
          />
          <Checkout
            dispatch={dispatch}
            chosenCartItem={chosenCartItem}
            setChosenCartItem={setChosenCartItem}
            checkoutCurrency={checkoutCurrency}
            handleApproveSpend={handleApproveSpend}
            approved={approved}
            setCheckoutCurrency={setCheckoutCurrency}
            walletConnected={walletConnected}
            lensConnected={lensConnected}
            openConnectModal={openConnectModal}
            oracleData={oracleData}
            checkoutItem={checkoutItem}
            checkoutLoading={checkoutLoading}
            fulfillmentDetails={fulfillmentDetails}
            setFulfillmentDetails={setFulfillmentDetails}
            loginLoading={signLoading}
            handleLogIn={handleLogIn}
          />
        </div>
      </div>
    </div>
  );
}
