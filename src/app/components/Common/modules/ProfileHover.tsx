import { FunctionComponent, useContext } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { ProfileHoverProps } from "../types/common.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import useHover from "../hooks/useHover";
import { ModalContext } from "@/app/providers";

const ProfileHover: FunctionComponent<ProfileHoverProps> = ({
  dict,
  setProfileHover,
  profile,
}) => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const { followLoading, handleFollow, handleUnfollow } = useHover(
    dict,
    profile
  );

  return (
    <div
      className="absolute bottom-4 right-4 rounded-md w-28 z-20 h-fit flex p-px"
      id="northern"
      onMouseLeave={() => setProfileHover(false)}
    >
      <div className="relative w-full h-full rounded-md bg-nave flex flex-col items-center justify-center gap-6 p-2">
        <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center cursor-pointer">
          <div
            className="relative w-7 h-7 rounded-full cursor-pointer p-px"
            onClick={() => {
              context?.setRouterChangeLoading(true);

              router.push(`/envoker/${profile?.username?.localName}`);
            }}
            id="northern"
          >
            <div className="relative w-full h-full flex items-center justify-center rounded-full">
              <Image
                layout="fill"
                draggable={false}
                src={handleProfilePicture(profile?.metadata?.picture)}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
          <div className="relative w-fit h-fit flex flex-col items-center justify-center font-bit text-xxs">
            <div className="relative flex w-fit h-fit break-words items-center justify-center text-white/50">
              {profile?.username?.value}
            </div>
            <div className="relative flex w-fit h-fit break-words items-center justify-center text-tee text-white">
              {profile?.username?.localName}
            </div>
          </div>
        </div>
        <div className="relative h-fit w-full flex flex-row gap-8 justify-center items-center mb-0 ">
          {[
            {
              function: () => handleFollow(),
              title: dict?.fff,
              loader: followLoading,
              canRun: !context?.lensConectado?.profile?.operations
                ?.isFollowedByMe
                ? false
                : true,
              icon: "QmadanZQr9dxDXQFG41d2gZrhbKgVvnVnG64qAzMhXyxmG",
            },
            {
              function: () => handleUnfollow(),
              title: dict?.uff,
              loader: followLoading,
              canRun: context?.lensConectado?.profile?.operations
                ?.isFollowedByMe
                ? true
                : false,
              icon: "QmSWjjhXh1VAEkNzhfzEojqg1dfSJ69Xf9ezxbKpwTRjZC",
            },
          ].map(
            (
              item: {
                function: () => void;
                title: string;
                loader: boolean;
                canRun: boolean;
                icon: string;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className={`relative w-fit h-fit flex items-center justify-center ${
                    !item.canRun
                      ? "opacity-70"
                      : "cursor-pointer hover:opacity-60"
                  }`}
                  title={item.title}
                  onClick={() => !item.loader && item.canRun && item.function()}
                >
                  {item?.loader ? (
                    <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                      <AiOutlineLoading size={15} color={"white"} />
                    </div>
                  ) : (
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <Image
                        layout="fill"
                        draggable={false}
                        src={`${INFURA_GATEWAY}/ipfs/${item.icon}`}
                      />
                    </div>
                  )}
                </div>
              );
            }
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHover;
