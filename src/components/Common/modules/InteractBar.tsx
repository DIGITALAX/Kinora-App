import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { InteractBarProps } from "../types/common.types";
import { AiOutlineLoading } from "react-icons/ai";
import { setQuote } from "../../../../redux/reducers/quoteSlice";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import ProfileHover from "./ProfileHover";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  publication,
  lensConnected,
  mirror,
  bookmark,
  like,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
  index,
  interactionsLoading,
  dispatch,
  profileHovers,
  setProfileHovers,
  unfollowProfile,
  followProfile,
  router
}): JSX.Element => {
  const pfp = createProfilePicture(publication?.by?.metadata?.picture);
  return (
    <div
      className="absolute bottom-2 w-full h-fit flex p-1 cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-full h-fit flex flex-row gap-4 justify-between items-center px-1 py-1.5 bg-black/90 rounded-md border border-white">
        <div className="relative w-full h-fit flex flex-row gap-2">
          {[
            {
              icon: "QmQG559iscGC7YY4pQCsQn4tfWG3k76dMjFmXnnxeoELzs",
              function: () => bookmark(publication?.id),
              title: "Save Quest",
              reacted: publication?.operations?.hasBookmarked,
              loader: false,
              width: "0.8rem",
              height: "1rem",
            },
            {
              icon: "QmWfqc2xwGpaGsja7f834zDEGEeiZLsT5qqBdeTrHkK8Bu",
              function: () =>
                setMirrorChoiceOpen((prev) => {
                  const arr = [...prev];
                  arr[index] = !arr[index];
                  return arr;
                }),
              title: "Mirror or Quote Quest",
              reacted:
                publication?.operations?.hasMirrored ||
                publication?.operations?.hasQuoted,
              loader: interactionsLoading?.[index]?.mirror,
              width: "1rem",
              height: "0.8rem",
            },
            {
              icon: "QmUAC59ETYvPYmAJxrnNMXy6M9SHEPXicCSMB2gSEP5TbC",
              function: () =>
                like(publication?.id, publication?.operations?.hasReported),
              title: "Like Quest",
              reacted: publication?.operations?.hasReacted,
              loader: interactionsLoading?.[index]?.like,
              width: "0.9rem",
              height: "0.9rem",
            },
          ]?.map(
            (
              item: {
                icon: string;
                function: () => void;
                title: string;
                reacted: boolean;
                loader: boolean;
                width: string;
                height: string;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className={`relative hover:opacity-80 w-7 p-1 h-6 rounded-full flex items-center cursor-pointer active:scale-95 justify-center ${
                    !item?.reacted && "hue-rotate-60"
                  } ${
                    !lensConnected?.id
                      ? "opacity-80"
                      : "cursor-pointer active:scale-95"
                  }`}
                  title={item?.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.function();
                  }}
                >
                  {item?.loader ? (
                    <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                      <AiOutlineLoading size={15} color={"white"} />
                    </div>
                  ) : (
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        width: item.width,
                        height: item.height,
                      }}
                    >
                      <Image
                        draggable={false}
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${item.icon}`}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center ml-auto">
          <div
            className="relative flex items-center justify-center rounded-full border border-white w-6 h-6 cursor-pointer"
            id="rainbow"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setProfileHovers!((prev) => {
                const arr = [...(prev || [])];
                arr[index] = true;
                return arr;
              });
            }}
          >
            {pfp && (
              <Image
                layout="fill"
                src={pfp}
                draggable={false}
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
        </div>
      </div>
      {mirrorChoiceOpen?.[index] && (
        <div className="absolute w-fit h-fit rounded-md bottom-10 flex flex-row gap-1.5 bg-black/90 p-1 border border-white">
          {[
            {
              icon: "QmWfqc2xwGpaGsja7f834zDEGEeiZLsT5qqBdeTrHkK8Bu",
              function: () => mirror(publication?.id),
              title: "Mirror Quest",
              reacted: publication?.operations?.hasMirrored,
              loader: interactionsLoading?.[index]?.mirror,
              width: "1rem",
              height: "0.8rem",
            },
            {
              icon: "QmeXejJgQMAe625N7pgncmEzxFqfJVvpvXKeGjvMtzVdzV",
              function: () =>
                dispatch(
                  setQuote({
                    actionOpen: true,
                    actionPublication: publication,
                  })
                ),
              title: "Quote Quest",
              reacted: publication?.operations?.hasQuoted,
              loader: false,
              width: "0.6rem",
              height: "0.6rem",
            },
          ]?.map(
            (
              item: {
                icon: string;
                function: () => void;
                title: string;
                reacted: boolean;
                loader: boolean;
                width: string;
                height: string;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className={`relative hover:opacity-80 w-7 p-1 h-6 rounded-full flex cursor-pointer active:scale-95 items-center justify-center ${
                    !item?.reacted && "hue-rotate-60"
                  } ${
                    !lensConnected?.id
                      ? "opacity-80"
                      : "cursor-pointer active:scale-95"
                  }`}
                  title={item.title}
                  onClick={(e) => {
                    e.stopPropagation();
                    item.function();
                  }}
                >
                  {item?.loader ? (
                    <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                      <AiOutlineLoading size={15} color={"white"} />
                    </div>
                  ) : (
                    <div
                      className="relative flex items-center justify-center"
                      style={{
                        width: item.width,
                        height: item.height,
                      }}
                    >
                      <Image
                        draggable={false}
                        layout="fill"
                        objectFit="contain"
                        src={`${INFURA_GATEWAY}/ipfs/${item.icon}`}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      )}
      {profileHovers?.[index] && (
        <ProfileHover
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          profile={publication?.by}
          index={index}
          followLoading={interactionsLoading?.[index]?.follow}
          unfollowLoading={interactionsLoading?.[index]?.unfollow}
          pfp={pfp}
          setProfileHovers={setProfileHovers}
          dispatch={dispatch}
          router={router}
        />
      )}
    </div>
  );
};

export default InteractBar;
