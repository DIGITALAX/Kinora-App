import { FunctionComponent } from "react";
import { ProfileHoverProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { setFollowCollect } from "../../../../redux/reducers/followCollectSlice";

const ProfileHover: FunctionComponent<ProfileHoverProps> = ({
  followProfile,
  unfollowProfile,
  index,
  profile,
  followLoading,
  unfollowLoading,
  pfp,
  setProfileHovers,
  router,
  dispatch,
}) => {
  return (
    <div
      className="absolute bottom-4 right-4 rounded-md w-28 z-20 h-fit flex flex-col items-center justify-center gap-6 bg-black/80 p-2 border border-white"
      onMouseLeave={() =>
        setProfileHovers((prev) => {
          const arr = [...(prev || [])];
          arr[index] = false;
          return arr;
        })
      }
    >
      <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center">
        <div
          className="relative w-6 h-6 rounded-full border border-white cursor-pointer"
          onClick={() =>
            router.push(
              `/envoker/${
                profile?.handle?.suggestedFormatted?.localName?.split("@")?.[1]}`
            )
          }
          id="rainbow"
        >
          {pfp && (
            <Image
              layout="fill"
              draggable={false}
              src={pfp}
              objectFit="cover"
              className="rounded-full"
            />
          )}
        </div>
        <div className="relative w-fit h-fit flex flex-col items-center justify-center font-bit text-xxs">
          <div className="relative flex w-fit h-fit break-words items-center justify-center text-white/50">
            {profile?.handle?.localName}
          </div>
          <div className="relative flex w-fit h-fit break-words items-center justify-center text-tee text-white">
            {profile?.handle?.suggestedFormatted?.localName}
          </div>
        </div>
      </div>
      <div className="relative h-fit w-full flex flex-row gap-8 justify-center items-center mb-0 ">
        {[
          {
            function: () =>
              profile?.followModule?.__typename === "FeeFollowModuleSettings"
                ? dispatch(
                    setFollowCollect({
                      actionType: "follow",
                      actionFollower: profile,
                    })
                  )
                : followProfile(profile?.id, index),
            title: "Follow Profile",
            loader: followLoading,
            canRun: profile?.operations?.isFollowedByMe?.isFinalisedOnchain
              ? false
              : true,
            icon: "QmPrvD8EaytmYcGAaNiictyFnWQg684A6xR98mxdgxEpPi",
          },
          {
            function: () => unfollowProfile(profile?.id, index),
            title: "Unfollow Profile",
            loader: unfollowLoading,
            canRun: profile?.operations?.isFollowedByMe?.isFinalisedOnchain
              ? true
              : false,
            icon: "QmPYVqTfYhtz1eq5pKFU3QcPugRz8enFA5tmmmND2j1Mri",
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
  );
};

export default ProfileHover;
