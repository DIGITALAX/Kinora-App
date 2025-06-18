import { INFURA_GATEWAY } from "@/app/lib/constants";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext, useState } from "react";
import ProfileHover from "../../Common/modules/ProfileHover";
import { QuestCompletedProps } from "../types/activity.types";
import { ModalContext } from "@/app/providers";

const QuestCompleted: FunctionComponent<QuestCompletedProps> = ({
  width,
  height,
  quest,
  dict,
  disabled,
}): JSX.Element => {
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px flex rounded-lg cursor-pointer"
        id="rainbow"
        style={{
          width,
          height,
        }}
        onClick={() => {
          context?.setRouterChangeLoading(true);
          router.push(`/envoker/${quest?.profile?.username?.localName}`);
        }}
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
      <div
        className={`relative w-full flex items-center sm:items-start justify-center sm:justify-start gap-6 ${
          disabled
            ? "h-fit flex-col"
            : "h-fit sm:h-[9.5rem] flex-col sm:flex-row"
        }`}
      >
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
              onClick={() => {
                context?.setRouterChangeLoading(true);
                router.push(`/quest/${quest?.post?.id}`);
              }}
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
                ? `${dict?.compM} ${quest?.milestone}`
                : `${dict?.compQ}`}
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
              {dict?.ready}
            </div>
          </div>
          <div className="relative w-full h-px bg-gray-700"></div>
          <div className="relative w-fit h-fit flex items-center justify-center text-gris text-xxs sm:text-xs break-words">
            {dict?.now}
          </div>
        </div>
        <div className="relative flex flex-col gap-1.5 sm:ml-auto items-center w-full sm:w-fit h-fit justify-center">
          <div className="relative w-full justify-end h-fit items-center flex mr-0 gap-2">
            <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit break-words text-xxs top-px">
              @
              {(quest?.profile?.username?.localName || "")?.length > 20
                ? quest?.profile?.username?.localName?.slice(0, 20) + "..."
                : quest?.profile?.username?.localName}
            </div>
            <div
              className="relative w-fit h-fit flex items-center justify-center p-px rounded-full"
              id="northern"
            >
              <div
                className="relative flex items-center justify-center rounded-full  w-6 h-6 cursor-pointer"
                onMouseEnter={(e) => {
                  e.stopPropagation();
                  !disabled && setProfileHover(true);
                }}
              >
                <Image
                  layout="fill"
                  src={handleProfilePicture(quest?.profile?.metadata?.picture)}
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                />
              </div>
            </div>
            {profileHover && !disabled && (
              <ProfileHover
                profile={quest?.profile!}
                setProfileHover={setProfileHover}
                dict={dict}
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
