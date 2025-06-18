import { FunctionComponent, JSX, useContext, useRef, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { PostCommentProps } from "../types/common.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { ModalContext } from "@/app/providers";
import setPostMedia from "@/app/lib/helpers/setPostMedia";
import MediaSwitch from "./MediaSwitch";

const PostComment: FunctionComponent<PostCommentProps> = ({
  dict,
  commentDetails,
  profilesOpen,
  comment,
  commentLoading,
  mentionProfiles,
  height,
  imageHeight,
  imageWidth,
  textElement,
  setCommentDetails,
  setProfilesOpen,
  searchProfiles,
  caretCoord,
  id,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const [contentLoading, setContentLoading] = useState<{
    image: boolean;
    video: boolean;
  }>({
    image: false,
    video: false,
  });
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2">
      <div
        className="relative w-full p-2 border border-gray-700 text-white font-vcr text-sm bg-nave flex items-center justify-center text-left rounded-md"
        style={{
          height,
        }}
      >
        <textarea
          className="bg-nave relative w-full text-xs h-full p-1 flex"
          style={{ resize: "none" }}
          value={commentDetails}
          onChange={(e) => {
            setCommentDetails(e.target.value);
            searchProfiles(e);
          }}
          ref={textElement}
        ></textarea>
        {mentionProfiles?.length > 0 && profilesOpen && (
          <div
            className={`absolute w-32 border border-gray-700 max-h-28 h-fit flex flex-col overflow-y-auto items-start justify-start z-60`}
            style={{
              top: caretCoord.y + 30,
              left: caretCoord.x,
            }}
          >
            {mentionProfiles?.map((user, indexTwo: number) => {
              return (
                <div
                  key={indexTwo}
                  className={`relative border-y border-gray-700 w-full h-10 px-3 py-2 bg-nave flex flex-row gap-3 cursor-pointer items-center justify-center`}
                  onClick={() => {
                    setProfilesOpen(false);

                    setCommentDetails(
                      (prev) =>
                        prev?.substring(0, prev?.lastIndexOf("@")) +
                        `${user?.username?.value}`
                    );
                  }}
                >
                  <div className="relative flex flex-row w-full h-full text-white font-vcr items-center justify-center gap-2">
                    <div
                      className={`relative rounded-full flex bg-nave w-3 h-3 items-center justify-center`}
                      id="pfp"
                    >
                      <Image
                        src={handleProfilePicture(user?.metadata?.picture)}
                        objectFit="cover"
                        alt="pfp"
                        layout="fill"
                        className="relative w-fit h-fit rounded-full items-center justify-center flex"
                        draggable={false}
                      />
                    </div>
                    <div className="relative items-center justify-center w-fit h-fit text-xxs flex">
                      {user?.username?.localName}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className="relative w-full h-fit flex flex-col sm:flex-row items-between justify-center sm:items-center sm:justify-between sm:gap-1.5 gap-4">
        <div className="relative w-full sm:w-fit h-fit items-center justify-start flex flex-row gap-2">
          {[
            ["QmetvVH6tdXP4ZfvB7ihH9J9oQ6KfVUVVktyHpbbaAzztX", dict?.image],
            ["QmNd2Rj7tzTJiN7vMbWaFoYJuUARUfEnXRpjKRkQ4uEKoD", dict?.video],
            ["QmVxaEvPaBfLdLfYX2bUV2Dze6NRDCtepHz7y4NJ6xojue", dict?.gifs],
            ["QmXA7NqjfnoLMWBoA2KsesRQb1SNGQBe2SBxkcT2jEtT4G", dict?.collO],
          ].map((image: string[], indexTwo: number) => {
            const loaders = [contentLoading?.image, contentLoading?.video];
            return loaders[indexTwo] ? (
              <div
                key={indexTwo}
                className={`relative flex items-center justify-center  ${
                  loaders[indexTwo] && "animate-spin"
                }`}
                title={image[1]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
              >
                <AiOutlineLoading size={15} color={"white"} />
              </div>
            ) : indexTwo !== 2 && indexTwo !== 3 ? (
              <label
                key={indexTwo}
                className={`relative flex items-center justify-center cursor-pointer active:scale-95`}
                title={image[1]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
              >
                {
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                    draggable={false}
                  />
                }
                <input
                  hidden
                  type="file"
                  accept={indexTwo === 0 ? "image/png, image/gif" : "video/mp4"}
                  multiple={true}
                  onChange={async (e: any) => {
                    if (!commentLoading && !contentLoading.image) {
                      setContentLoading((prev) => ({
                        ...prev,
                        image: true,
                      }));
                      const media = await setPostMedia(
                        e,
                        "image/png",
                        id,
                        context?.postInfo?.media
                      );

                      if (media) {
                        context?.setPostInfo((prev) => ({
                          ...prev,
                          media,
                        }));
                      }

                      setContentLoading((prev) => ({
                        ...prev,
                        image: false,
                      }));
                    } else if (!commentLoading && !contentLoading.video) {
                      setContentLoading((prev) => ({
                        ...prev,
                        video: true,
                      }));
                      const media = await setPostMedia(
                        e,
                        "video/mp4",
                        id,
                        context?.postInfo?.media
                      );
                      if (media) {
                        context?.setPostInfo((prev) => ({
                          ...prev,
                          media,
                        }));
                      }

                      setContentLoading((prev) => ({
                        ...prev,
                        video: false,
                      }));
                    }
                  }}
                />
              </label>
            ) : (
              <div
                key={indexTwo}
                className={`relative flex items-center justify-center cursor-pointer active:scale-95`}
                title={image[1]}
                style={{
                  height: imageHeight,
                  width: imageWidth,
                }}
                onClick={() =>
                  indexTwo === 2
                    ? context?.setGif({ open: true, id })
                    : context?.setCollectOptions({
                        open: true,
                        id,
                      })
                }
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${image[0]}`}
                  draggable={false}
                />
              </div>
            );
          })}
        </div>
        <div className="relative w-full sm:w-fit h-fit items-center justify-end flex">
          <div
            className={`relative w-20 h-8 font-vcr text-white flex items-center justify-center bg-fuego border border-gray-700 text-xs rounded-sm ${
              !commentLoading &&
              context?.lensConectado?.profile &&
              "cursor-pointer active:scale-95"
            }`}
            onClick={() => context?.lensConectado?.profile && comment()}
          >
            <div
              className={`${
                commentLoading && "animate-spin"
              } relative w-fit h-fit flex items-center justify-center text-center`}
            >
              {commentLoading ? (
                <AiOutlineLoading size={15} color="white" />
              ) : (
                dict?.send
              )}
            </div>
          </div>
        </div>
      </div>
      {Number(context?.postInfo?.media?.[id]?.length) > 0 && (
        <div className="relative w-full h-fit flex overflow-x-scroll justify-start items-start pt-4">
          <div className="relative gap-4 items-center justify-start flex flex-row">
            {context?.postInfo?.media?.[id]?.map(
              (
                media: {
                  type: string;
                  item: string;
                },
                indexTwo: number
              ) => {
                return (
                  <div
                    key={indexTwo}
                    className="relative w-40 h-40 rounded-md flex items-center justify-center border border-gray-700"
                  >
                    <MediaSwitch
                      postId={id}
                      type={media.type !== "video" ? "image" : "video"}
                      classNameImage={"rounded-md"}
                      classNameAudio={"rounded-md"}
                      classNameVideo={{
                        borderRadius: "0.375rem",
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                        position: "relative",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                      }}
                      srcUrl={media?.item}
                    />
                    <div
                      className="absolute w-5 h-5 bg-nave p-px -right-2 -top-2 bg-nave rounded-full cursor-pointer flex items-center justify-center border border-gray-700 z-10"
                      onClick={() =>
                        context?.setPostInfo((prev) => {
                          let newArray = { ...prev?.media };

                          newArray[id] = newArray[id]?.filter(
                            (im) => im?.item !== media?.item
                          );

                          return {
                            ...prev,
                            media: newArray,
                          };
                        })
                      }
                    >
                      <ImCross color={"white"} size={8} />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComment;
