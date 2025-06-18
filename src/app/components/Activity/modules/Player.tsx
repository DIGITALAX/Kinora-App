import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext, useState } from "react";
import { PlayerProps } from "../types/activity.types";
import { useRouter } from "next/navigation";
import ProfileHover from "../../Common/modules/ProfileHover";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { ModalContext } from "@/app/providers";

const Player: FunctionComponent<PlayerProps> = ({
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
            src={`${INFURA_GATEWAY}/ipfs/QmdJk1M4QRGcCspQQTuB16uSzsWmFmVXFM6pVBZFimbbWz`}
            objectFit="cover"
            draggable={false}
            className="rounded-lg"
            layout="fill"
          />
        </div>
      </div>
      <div className="relative w-full flex flex-col sm:flex-row items-start justify-start gap-2 h-16 p-2 border border-white rounded-sm">
        <div className="absolute top-0 left-0 flex flex-row ml-auto items-center justify-center w-full h-full z-0">
          <div className="relative w-full h-full flex items-center justify-center rounded-sm">
            <Image
              layout="fill"
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/${
                quest?.questMetadata?.cover?.split("ipfs://")?.[1]
              }`}
              objectFit={"cover"}
              className="rounded-sm"
            />
            <div
              className="absolute top-0 left-0 w-full h-full items-center justify-center flex rounded-sm"
              id="fadeSide"
            ></div>
          </div>
        </div>
        <div className="relative flex items-start justify-between w-fit h-full flex-col gap-1.5">
          <div
            className="relative flex items-center justify-center border border-suave py-px px-1 rounded-md cursor-pointer active:scale-95"
            onClick={() => {
              context?.setRouterChangeLoading(true);
              router.push(`/quest/${quest?.post?.id}`);
            }}
          >
            <div className="relative w-fit font-bit h-fit text-xs break-words flex items-center justify-center text-white">
              {quest?.questMetadata?.title?.length > 15
                ? quest?.questMetadata?.title?.slice(0, 15) + "..."
                : quest?.questMetadata?.title}{" "}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
          </div>
          <div className="relative w-full h-fit flex items-center justify-between font-bit text-xxs break-words gap-3">
            <div className="relative flex flex-row gap-1.5 items-center justify-center">
              <div className="relative w-3 h-3 flex items-center justify-center flex">
                <Image
                  draggable={false}
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmS6GgvqEKRjvXtYfiXWTQZMz7nt2ucuKFaWv8sTgUDGNq`}
                />
              </div>
              <div className="text-gris relative flex items-center justify-center">
                {dict?.play}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative w-full justify-end h-fit items-center flex mr-0 gap-2">
        <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-xxs top-px">
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
    </div>
  );
};

export default Player;
