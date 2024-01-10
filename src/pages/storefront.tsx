import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ConnectFirst from "@/components/Common/modules/ConnectFirst";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import useUpload from "@/components/Upload/hooks/useUpload";
import handleMediaUpload from "../../lib/helpers/handleMediaUpload";
import {
  HASHTAG_CONSTANTS,
  INFURA_GATEWAY,
  IPFS_REGEX,
} from "../../lib/constants";
import CollectOptions from "@/components/Upload/modules/CollectOptions";
import { AiOutlineLoading } from "react-icons/ai";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import Head from "next/head";

export default function Storefront() {
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
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
    allUploaded
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
          Kinora Collections
        </div>
        <div className="relative w-full h-fit flex items-start justify-start flex-row text-xs gap-4"></div>
      </div>
    </div>
  );
}
