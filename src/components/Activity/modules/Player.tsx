import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { VideoMetadataV3 } from "kinora-sdk/dist/@types/generated";
import { PlayerProps } from "../types/activity.types";
import ProfileHover from "@/components/Common/modules/ProfileHover";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";

const Player: FunctionComponent<PlayerProps> = ({
  width,
  height,
  router,
  quest,
  dispatch,
  index,
  interactionsLoading,
  followProfile,
  unfollowProfile,
  setProfileHovers,
  profileHovers,
  disabled,
}): JSX.Element => {
  const pfp = createProfilePicture(quest?.profile?.metadata?.picture);
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px flex rounded-lg cursor-pointer"
        id="rainbow"
        style={{
          width,
          height,
        }}
        onClick={() =>
          router.push(
            `/envoker/${
              quest?.profile?.handle?.suggestedFormatted?.localName?.split(
                "@"
              )?.[1]
            }`
          )
        }
      >
        <div className="relative rounded-lg w-full h-full flex items-center justify-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/QmdJk1M4QRGcCspQQTuB16uSzsWmFmVXFM6pVBZFimbbWz`}
            objectFit="cover"
            draggable={false}
            className="rounded-lg"
            layout="fill"
          />
        </div>
      </div>
      <div className="relative w-full flex flex-row items-start justify-start gap-2">
        <div className="relative flex items-start justify-between w-fit h-full flex-col gap-1.5">
          <div className="relative flex items-center justify-center border border-suave py-px px-1 rounded-md">
            <div className="relative w-fit font-bit h-fit text-xs break-words flex items-center justify-center text-white">
              {quest?.questMetadata?.title?.length > 15
                ? quest?.questMetadata?.title?.slice(0, 15)
                : quest?.questMetadata?.title}{" "}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
          </div>
          <div className="relative w-full h-fit flex items-center justify-between font-bit text-xs break-words gap-3">
            <div className="relative flex flex-row gap-1.5 items-center justify-center">
              <div className="relative w-3 h-3 flex items-center justify-center">
                <Image
                  draggable={false}
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmS6GgvqEKRjvXtYfiXWTQZMz7nt2ucuKFaWv8sTgUDGNq`}
                />
              </div>
              <div className="text-gris relative flex items-center justify-center">
                Player Joined Quest
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-white">
              {(quest?.publication?.metadata as VideoMetadataV3)?.title
                ?.length > 20
                ? (
                    quest?.publication?.metadata as VideoMetadataV3
                  )?.title?.slice(0, 20) + "..."
                : (quest?.publication?.metadata as VideoMetadataV3)?.title}
            </div>
          </div>
        </div>

        <div className="relative flex flex-row gap-1.5 ml-auto items-center justify-center">
          <div className="relative w-fit h-fit flex items-center justify-center break-words top-px font-bit text-white text-xxs">
            Quest <br /> Origin <br /> {">"}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-end">
            <div
              className="relative w-28 h-12 flex items-center justify-center rounded-md p-px cursor-pointer"
              id="rainbow"
              onClick={() => router.push(`/quest/${quest?.publication?.id}`)}
            >
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  layout="fill"
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/${
                    quest?.questMetadata?.cover?.split("ipfs://")?.[1]
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full justify-end h-fit items-center flex mr-0 gap-2">
        <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-xxs top-px">
          @
          {(quest?.profile?.handle?.localName || "")?.length > 20
            ? quest?.profile?.handle?.localName?.slice(0, 20) + "..."
            : quest?.profile?.handle?.localName}
        </div>
        <div
          className="relative w-fit h-fit flex items-center justify-center p-px rounded-full"
          id="northern"
        >
          <div
            className="relative flex items-center justify-center rounded-full  w-6 h-6 cursor-pointer"
            onMouseEnter={(e) => {
              e.stopPropagation();
              !disabled &&
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
        {profileHovers?.[index] && !disabled && (
          <ProfileHover
            followProfile={followProfile!}
            unfollowProfile={unfollowProfile!}
            profile={quest?.profile!}
            index={index}
            followLoading={interactionsLoading?.[index]?.follow!}
            unfollowLoading={interactionsLoading?.[index]?.unfollow!}
            pfp={pfp}
            setProfileHovers={setProfileHovers!}
            dispatch={dispatch}
            router={router}
            main={false}
          />
        )}
      </div>
    </div>
  );
};

export default Player;
