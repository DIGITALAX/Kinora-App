import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ConnectFirst from "@/components/Common/modules/ConnectFirst";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import useUpload from "@/components/Upload/hooks/useUpload";
import handleMediaUpload from "../../lib/helpers/handleMediaUpload";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import {
  HASHTAG_CONSTANTS,
  INFURA_GATEWAY,
  IPFS_REGEX,
} from "../../lib/constants";
import CollectOptions from "@/components/Upload/modules/CollectOptions";
import { AiOutlineLoading } from "react-icons/ai";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";

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
  const availableCurrencies = useSelector(
    (state: RootState) => state.app.availableCurrenciesReducer.currencies
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const { handleLogIn, signLoading } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address
  );
  const {
    uploadLoading,
    handleVideoPost,
    postDetails,
    setPostDetails,
    openMeasure,
    setOpenMeasure,
  } = useUpload(address, dispatch, availableCurrencies, publicClient);
  return (
    <>
      {walletConnected && lensConnected ? (
        <div
          className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end"
          style={{
            height: "calc(100vh - 5.5rem)",
          }}
        >
          <div
            className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative gap-10 flex flex-col font-bit text-white"
            style={{
              width: openSidebar
                ? "calc(100vw - 10rem)"
                : "calc(100vw - 2.5rem)",
            }}
            id={!openSidebar ? "closeSide" : ""}
          >
            <div className="relative w-fit h-fit flex items-start justify-start text-xl">
              Upload A New Video
            </div>
            <div className="relative w-full h-fit flex items-start justify-start flex-row text-xs gap-4">
              <label
                className={`relative flex items-center w-full h-80 rounded-md justify-center z-0 cursor-pointer p-px`}
                id="rainbow"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-md">
                  {postDetails?.video && (
                    <MediaSwitch
                      type="video"
                      classNameVideo="object-cover w-full h-full flex items-center justify-center rounded-md"
                      srcUrl={
                        IPFS_REGEX.test(postDetails?.video)
                          ? `${INFURA_GATEWAY}/ipfs/${postDetails?.video}`
                          : postDetails?.video
                      }
                    />
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
              <div className="relative w-full h-fit flex flex-col gap-8 items-center justify-center">
                <div className="relative w-full h-fit flex items-start justify-start gap-1 flex-col">
                  <div className="relative w-fit h-fit flex items-start justify-start">
                    Title
                  </div>
                  <input
                    className="h-10 w-full bg-nave border border-white rounded-md p-1 text-xs"
                    value={postDetails?.title}
                    onChange={(e) =>
                      setPostDetails((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
                  <div className="relative w-fit h-fit text-xs break-words">
                    Discovery Tags
                  </div>
                  <input
                    value={postDetails?.tags}
                    onChange={(e) =>
                      setPostDetails((prev) => ({
                        ...prev,
                        tags: e.target.value,
                      }))
                    }
                    className="relative rounded-md bg-nave p-1 text-xs border border-white h-10 w-full"
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
                      <div className="absolute top-16 z-10 w-full max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
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
                <div className="relative w-full h-fit flex items-start justify-start gap-1 flex-col">
                  <div className="relative w-fit h-fit flex items-start justify-start">
                    Quest Description
                  </div>
                  <textarea
                    className="h-28 w-full bg-nave border border-white rounded-md p-2 text-xs"
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

            <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start pb-7">
              <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
                <div className="relative w-fit h-fit text-sm break-words">
                  Collect Options
                </div>
                <CollectOptions
                  availableCurrencies={availableCurrencies}
                  postDetails={postDetails}
                  setPostDetails={setPostDetails}
                  openMeasure={openMeasure}
                  setOpenMeasure={setOpenMeasure}
                />
              </div>
              <div className="relative w-full h-full items-end justify-end flex">
                <div
                  className="relative w-32 h-9 flex items-center justify-center border border-white cursor-pointer active:scale-95"
                  onClick={() => !uploadLoading && handleVideoPost()}
                >
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center text-xs ${
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
