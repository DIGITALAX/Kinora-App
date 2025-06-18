"use client";

import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useContext } from "react";
import usePageProfile from "../hooks/usePageProfile";
import { AiOutlineLoading } from "react-icons/ai";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { handleImage } from "@/app/lib/helpers/handleImage";
import { AccountType } from "../../Common/types/common.types";
import Bio from "./Bio";
import useHover from "../../Common/hooks/useHover";
import AccountSwitch from "./AccountSwitch";
import { Dispatch, Envoker } from "../../../../../../kinorasdk_refactor/dist";

export default function EnvokerEntry({
  dict,
  handle,
}: {
  dict: any;
  handle: string;
}) {
  const context = useContext(ModalContext);
  const questEnvoker = new Envoker({
    authedApolloClient: context?.lensConectado?.apollo as any,
  });
  const kinoraDispatch = new Dispatch({
    playerAuthedApolloClient: context?.lensConectado?.apollo as any,
  });
  const { profileLoading, pageProfile, questsLoading, quests, info, getMore } =
    usePageProfile(handle);
  const { followLoading, handleFollow, handleUnfollow, accountStats } =
    useHover(dict, pageProfile!, true);

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col gap-10"
        style={{
          width:
            typeof window !== "undefined" &&
            window.innerWidth > 684 &&
            context?.openSidebar
              ? "calc(100vw - 10rem)"
              : "calc(100vw - 2.5rem)",
        }}
        id={!context?.openSidebar ? "closeSide" : ""}
      >
        <div className="w-full h-fit flex flex-col gap-3 relative">
          <div
            className={`relative w-full h-fit rounded-sm flex p-px ${
              profileLoading && "animate-pulse"
            }`}
            id="northern"
          >
            <div className="relative w-full h-40 flex items-center justify-center rounded-sm">
              <Image
                draggable={false}
                src={handleImage(pageProfile?.metadata?.coverPicture)}
                className="rounded-sm"
                objectFit="cover"
                layout="fill"
              />
              <div
                className="absolute w-full h-full rounded-sm"
                id="negro"
              ></div>
            </div>
            <div
              className="absolute w-12 h-12 sm:w-20 sm:h-20 right-4 bottom-4 rounded-full p-px"
              id="northern"
            >
              <div className="relative w-full h-full flex items-center justify-center rounded-full">
                <Image
                  draggable={false}
                  src={handleProfilePicture(pageProfile?.metadata?.picture)}
                  objectFit="cover"
                  layout="fill"
                  className="rounded-full"
                />
              </div>
            </div>
            {context?.lensConectado?.profile?.address !==
              pageProfile?.address && (
              <div
                className={`absolute left-2 top-2 flex rounded-sm bg-nave/70 border border-white flex items-center justify-center ${
                  !followLoading && "cursor-pointer active:scale-95"
                }`}
                onClick={
                  !pageProfile?.operations?.isFollowedByMe
                    ? () => !followLoading && handleFollow()
                    : () => !followLoading && handleUnfollow()
                }
              >
                <div
                  className={`"relative w-16 h-5 text-xxs font-bit text-white flex items-center justify-center px-1.5 py-1 ${
                    followLoading ? "animate-spin" : "top-px"
                  }`}
                >
                  {followLoading ? (
                    <AiOutlineLoading color="white" size={12} />
                  ) : pageProfile?.operations?.isFollowedByMe ? (
                    dict?.u
                  ) : (
                    dict?.f
                  )}
                </div>
              </div>
            )}
          </div>
          {context?.accountType !== AccountType.Dashboard &&
            context?.accountType !== AccountType.Save && (
              <Bio
                accountStats={accountStats!}
                dict={dict}
                profile={pageProfile!}
              />
            )}
        </div>
        <div
          className="relative w-full h-fit flex flex-col gap
        -3 justify-start items-start"
        >
          <AccountSwitch
            dict={dict}
            pageProfile={pageProfile}
            questsLoading={questsLoading}
            info={info}
            getMore={getMore}
            quests={quests}
            globalLoading={profileLoading}
            questEnvoker={questEnvoker!}
            kinoraDispatch={kinoraDispatch!}
          />
        </div>
      </div>
    </div>
  );
}
