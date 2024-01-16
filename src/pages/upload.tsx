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
import { polygon } from "viem/chains";
import Head from "next/head";

export default function Upload() {
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
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
  const verifiedEnvoker = useSelector(
    (state: RootState) => state.app.verifiedEnvokerReducer.value
  );
  const allUploaded = useSelector(
    (state: RootState) => state.app.allUploadedReducer.videos
  );
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer.currencies
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
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
    oracleData,
    publicClient
  );
  const {
    uploadLoading,
    handleVideoPost,
    postDetails,
    setPostDetails,
    openMeasure,
    setOpenMeasure,
  } = useUpload(
    address,
    dispatch,
    availableCurrencies,
    publicClient,
    allUploaded,
    lensConnected,
    verifiedEnvoker
  );
  return (
    <>
      {walletConnected && lensConnected ? (
        <div
          className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5 font-bit text-white"
          style={{
            height: "calc(100vh - 5.5rem)",
          }}
        >
          <Head>
            <title>Upload</title>
            <meta
              name="og:url"
              content={`https://kinora.irrevocable.dev/upload`}
            />
            <meta name="og:title" content={"Upload"} />
            <meta name="og:description" content={"Video Upload."} />
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
              content={`https://kinora.irrevocable.dev/upload`}
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
            className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col"
            style={{
              width:
                typeof window !== "undefined" &&
                window.innerWidth > 684 &&
                openSidebar
                  ? "calc(100vw - 10rem)"
                  : "calc(100vw - 2.5rem)",
            }}
            id={!openSidebar ? "closeSide" : ""}
          >
            <div className="relative w-fit h-fit flex items-start justify-start text-2xl pb-10">
              Upload A New Video
            </div>
            <div className="relative w-full h-fit flex items-start justify-start flex-col md:flex-row text-xs gap-4">
              <div className="relative w-full h-fit flex items-start justify-start flex-col gap-5 order-2 md:order-1">
                <label
                  className={`relative flex items-center w-full h-80 rounded-md justify-center z-0 cursor-pointer p-px`}
                  id="northern"
                >
                  <div className="relative w-full h-full flex items-center justify-center rounded-md">
                    {postDetails?.video && (
                      <video
                        className="rounded-md object-cover w-full h-full relative flex items-center justify-center"
                        draggable={false}
                        muted
                        autoPlay
                      >
                        <source
                          src={
                            IPFS_REGEX.test(postDetails?.video)
                              ? `${INFURA_GATEWAY}/ipfs/${postDetails?.video}`
                              : postDetails?.video
                          }
                        />
                      </video>
                    )}
                    <input
                      hidden
                      className="z-0"
                      type="file"
                      accept={"video/mp4"}
                      multiple={true}
                      onChange={(e) => {
                        e?.target?.files?.[0] &&
                          handleMediaUpload(
                            e,
                            () => {},
                            () => {},
                            (video: string) =>
                              setPostDetails((prev) => ({
                                ...prev,
                                video,
                              }))
                          );
                      }}
                    />
                  </div>
                </label>
                <div className="relative w-full h-full items-end justify-end flex">
                  <div
                    className="relative w-32 h-9 flex items-center justify-center border border-white cursor-pointer active:scale-95"
                    onClick={() => !uploadLoading && handleVideoPost()}
                  >
                    <div
                      className={`relative w-fit h-fit flex items-center justify-center text-sm ${
                        uploadLoading && "animate-spin"
                      }`}
                    >
                      {uploadLoading ? (
                        <AiOutlineLoading size={15} color={"white"} />
                      ) : (
                        "post video"
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-8 items-center justify-center order-1 md:order-2">
                <div className="relative w-full h-fit flex items-center justify-center gap-3 flex-row">
                  <div className="relative w-fit h-fit text-xs break-words flex items-center justify-center">
                    Title{" "}
                    <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
                  </div>
                  <input
                    className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
                    value={postDetails?.title}
                    onChange={(e) =>
                      setPostDetails((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col items-start justify-start w-full h-fit gap-3 relative">
                  <div className="relative w-fit h-fit text-xs break-words flex items-center justify-center">
                    Discovery Tags{" "}
                    <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
                  </div>
                  <input
                    value={postDetails?.tags}
                    onChange={(e) =>
                      setPostDetails((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    className="relative rounded-md bg-black p-1 text-xs border border-acei h-10 w-full"
                    style={{
                      resize: "none",
                    }}
                  />
                  {postDetails?.tags?.split(",").pop()?.trim() &&
                    HASHTAG_CONSTANTS?.some((tag) =>
                      tag
                        .toLowerCase()
                        .includes(
                          postDetails?.tags
                            ?.split(",")
                            ?.pop()
                            ?.trim()
                            ?.toLowerCase()!
                        )
                    ) && (
                      <div className="absolute top-16 z-10 w-full max-h-[6rem] h-fit flex bg-black border border-sol rounded-md overflow-y-scroll">
                        <div className="relative w-full h-fit flex flex-col items-center justify-start">
                          {HASHTAG_CONSTANTS?.filter((tag) =>
                            tag.toLowerCase().includes(
                              postDetails?.tags
                                ?.split(/,\s*|\s+|\s*$/)
                                ?.pop()
                                ?.toLowerCase() || ""
                            )
                          ).map((tag: string, index: number) => (
                            <div
                              key={index}
                              className="relative py-1 h-10 w-full flex items-center justify-center text-white border-y border-sol font-aust text-xs cursor-pointer hover:opacity-80"
                              onClick={() => {
                                const allArray = postDetails?.tags
                                  ?.split(/,\s*/)
                                  ?.map((t) => t.trim());

                                if (!allArray.includes(tag.trim())) {
                                  const tagsArray =
                                    postDetails?.tags?.split(/,\s*/);
                                  tagsArray[tagsArray?.length - 1] = tag;
                                  const newTags = tagsArray?.join(", ") + ", ";

                                  setPostDetails((prev) => ({
                                    ...prev,
                                    tags: newTags,
                                  }));
                                }
                              }}
                            >
                              <div className="relative w-fit h-fit flex items-center gap-1.5 justify-start">
                                {tag}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
                <div className="flex flex-col items-start justify-start w-full h-fit gap-3 relative">
                  <div className="relative w-fit h-fit text-xs break-words flex items-center justify-center">
                    Description{" "}
                    <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
                  </div>
                  <textarea
                    className="h-28 w-full bg-black border border-acei rounded-md p-2 text-xs"
                    style={{
                      resize: "none",
                    }}
                    value={postDetails?.description}
                    onChange={(e) =>
                      setPostDetails((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start py-7">
              <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
                <div className="relative w-fit h-fit text-md break-words">
                  Collect Options
                </div>
                <CollectOptions
                  availableCurrencies={availableCurrencies}
                  postDetails={postDetails}
                  setPostDetails={setPostDetails}
                  openMeasure={openMeasure}
                  setOpenMeasure={setOpenMeasure}
                  border
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <ConnectFirst
          signLoading={signLoading}
          openConnectModal={openConnectModal}
          handleLogIn={handleLogIn}
          walletConnected={walletConnected}
        />
      )}
    </>
  );
}
