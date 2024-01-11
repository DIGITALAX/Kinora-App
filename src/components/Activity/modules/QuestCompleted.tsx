import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { QuestCompletedProps } from "../types/activity.types";
import ProfileHover from "@/components/Common/modules/ProfileHover";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";

const QuestCompleted: FunctionComponent<QuestCompletedProps> = ({
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
            src={`${INFURA_GATEWAY}/ipfs/QmNvmnSj158e83GtrqkkTMpWoxA3zJX31dK5dL95DKuMSG`}
            objectFit="cover"
            draggable={false}
            className="rounded-lg"
            layout="fill"
          />
        </div>
      </div>
      <div className={`relative w-full flex items-center sm:items-start justify-center sm:justify-start gap-6 ${disabled ? "h-fit flex-col" : "h-fit sm:h-[9.5rem] flex-col sm:flex-row"}`}>
        <div className="relative flex items-start justify-between w-full h-full flex-col gap-1.5 border font-bit border-gris rounded-md p-2">
          <div className="absolute bottom-0 left-0 w-full h-full flex items-center justify-center rounded-md z-0">
            <Image
              layout="fill"
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/${
                quest?.questMetadata?.cover?.split("ipfs://")?.[1]
              }`}
              className="rounded-md"
              objectFit={"cover"}
            />
            <div
              className="absolute top-0 left-0 w-full h-full items-center justify-center flex rounded-md"
              id="fadeOut"
            ></div>
          </div>
          <div className="absolute top-1 right-1 w-fit h-fit flex items-center justify-center">
            <div
              className="relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() => router.push(`/quest/${quest?.publication?.id}`)}
            >
              <Image
                layout="fill"
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
              />
            </div>
          </div>
          <div className="relative flex items-start justify-start rounded-md">
            <div className="relative w-fit font-bit h-fit text-xxs sm:text-xs break-words flex items-center justify-center text-white">
              {quest?.type == "milestone"
                ? `Completed Milestone ${quest?.milestone}`
                : `Quest Completed`}
            </div>
          </div>
          <div className="relative flex flex-row gap-1.5 items-center justify-center">
            <div className="relative w-3 h-3 flex items-center justify-center">
              <Image
                draggable={false}
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/QmS6GgvqEKRjvXtYfiXWTQZMz7nt2ucuKFaWv8sTgUDGNq`}
              />
            </div>
            <div className="text-olive relative flex items-center justify-center text-xs sm:text-sm break-words">
              Rewards Ready For Claim
            </div>
          </div>
          <div className="relative w-full h-px bg-gray-700"></div>
          <div className="relative w-fit h-fit flex items-center justify-center text-gris text-xxs sm:text-xs break-words">
            Continue until you complete them all, or find a new quest to join
            now.
          </div>
        </div>
        <div className="relative flex flex-col gap-1.5 sm:ml-auto items-center w-full sm:w-fit h-fit justify-center">
          <div className="relative w-full justify-end h-fit items-center flex mr-0 gap-2">
            <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit break-words text-xxs top-px">
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
          <div className="relative w-full sm:w-fit h-full flex items-center justify-end">
            <div className="relative w-24 h-28 flex items-center justify-center rounded-md">
              <div className="relative w-full h-full flex items-center justify-center rounded-md">
                <Image
                  layout="fill"
                  draggable={false}
                  className="rounded-md"
                  objectFit={"cover"}
                  src={`${INFURA_GATEWAY}/ipfs/${quest?.completedImage}`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestCompleted;
