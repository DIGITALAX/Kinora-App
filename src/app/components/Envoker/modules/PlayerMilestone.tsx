import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import PlayerValues from "../../Video/modules/PlayerValues";
import { PlayerMilestoneProps } from "../types/envoker.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { handleMedia } from "@/app/lib/helpers/handleMedia";
import { VideoMetadata } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";

const PlayerMilestone: FunctionComponent<PlayerMilestoneProps> = ({
  setOpenPlayerDetails,
  index,
  quest,
  openPlayerDetails,
  approvePlayerMilestone,
  approvalLoading,
  playerEligible,
  dict,
  player,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col gap-3">
      {!player && (
        <div className="relative w-full h-fit flex overflow-x-scroll">
          <div className="relative w-fit h-fit flex flex-row gap-2">
            {quest?.players?.filter(
              (player) => !player?.questsCompleted?.includes(quest?.questId)
            )?.length > 0 ? (
              quest?.players
                ?.filter(
                  (player) => !player?.questsCompleted?.includes(quest?.questId)
                )
                ?.map((player, playerIndex: number) => {
                  return (
                    <div
                      key={playerIndex}
                      className="relative rounded-full cursor-pointer p-px w-8 h-8"
                      id="northern"
                      onClick={() =>
                        setOpenPlayerDetails(
                          openPlayerDetails?.profile?.address ==
                            player?.profile?.address
                            ? undefined
                            : player!
                        )
                      }
                    >
                      <div className="relative w-full h-full rounded-full flex">
                        <Image
                          src={handleProfilePicture(
                            player?.profile?.metadata?.picture
                          )}
                          draggable={false}
                          layout="fill"
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="relative w-full h-fit flex items-center justify-center text-center text-gray-500 font-bit text-xxs">
                {dict?.actP}
              </div>
            )}
          </div>
        </div>
      )}
      {openPlayerDetails && (player || (!player && quest?.status)) && (
        <div className="relative w-full h-fit flex flex-col gap-6">
          {!player && (
            <div className="relative w-full h-fit flex items-center justify-start flex-row gap-2">
              <div
                className="relative w-fit h-fit flex items-center justify-center cursor-pointer"
                onClick={() => {
                  context?.setRouterChangeLoading(true);

                  router.push(
                    `/envoker/${openPlayerDetails?.profile?.username?.localName}`
                  );
                }}
              >
                <div className="relative w-4 h-4 flex items-end justify-end">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                    draggable={false}
                    layout="fill"
                  />
                </div>
              </div>
              {playerEligible?.eligible && (
                <div
                  title="Verify Player for Rewards Claim"
                  className={`relative w-28 h-7 flex items-center justify-center font-bit text-white text-xxs border border-suave rounded-sm px-1.5 py-1 ${
                    openPlayerDetails!?.eligibile?.[
                      openPlayerDetails?.milestonesCompleted?.findIndex(
                        (value) => value?.questId == quest?.questId
                      ) == -1 ||
                      openPlayerDetails?.milestonesCompleted?.findIndex(
                        (value) => value?.questId == quest?.questId
                      )
                        ? 1
                        : openPlayerDetails!?.milestonesCompleted?.findIndex(
                            (value) => value?.questId == quest?.questId
                          )
                    ]?.status ||
                    approvalLoading[index] ||
                    !quest?.status
                      ? "opacity-70"
                      : "cursor-pointer active:scale-95 hover:opacity-70"
                  }`}
                  onClick={() =>
                    !openPlayerDetails!?.eligibile?.[
                      openPlayerDetails?.milestonesCompleted?.findIndex(
                        (value) => value?.questId == quest?.questId
                      ) == -1 ||
                      openPlayerDetails?.milestonesCompleted?.findIndex(
                        (value) => value?.questId == quest?.questId
                      )
                        ? 1
                        : openPlayerDetails!?.milestonesCompleted?.findIndex(
                            (value) => value?.questId == quest?.questId
                          )
                    ]?.status &&
                    !approvalLoading[index] &&
                    playerEligible?.eligible &&
                    quest?.status &&
                    approvePlayerMilestone(
                      Number(quest?.questId),
                      openPlayerDetails?.milestonesCompleted?.findIndex(
                        (value) => value?.questId == quest?.questId
                      ) == -1 ||
                        !openPlayerDetails?.milestonesCompleted?.findIndex(
                          (value) => value?.questId == quest?.questId
                        )
                        ? 1
                        : openPlayerDetails!?.milestonesCompleted?.findIndex(
                            (value) => value?.questId == quest?.questId
                          ),
                      openPlayerDetails!?.profile?.address,
                      index
                    )
                  }
                >
                  <div
                    className={`relative w-fit h-fit flex items-center justify-center ${
                      approvalLoading[index] ? "animate-spin" : "top-px"
                    }`}
                  >
                    {!quest?.status ? (
                      dict?.cloQ
                    ) : approvalLoading[index] ? (
                      <AiOutlineLoading color="white" size={12} />
                    ) : (
                      dict?.veM
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {(player
            ? quest?.milestones
                ?.reduce(
                  (acc, obj) =>
                    acc.concat(
                      obj.videos?.map((item) => ({
                        ...item,
                        milestone: obj?.milestoneId,
                      })) as any
                    ),
                  []
                )
                ?.sort(
                  (a, b) =>
                    Number((a as any).milestone) - Number((b as any).milestone)
                )
            : quest?.milestones?.[
                Number(
                  openPlayerDetails?.milestonesCompleted?.[
                    openPlayerDetails?.milestonesCompleted?.findIndex(
                      (value) => value?.questId == quest?.questId
                    ) == -1 ||
                    openPlayerDetails?.milestonesCompleted?.findIndex(
                      (value) => value?.questId == quest?.questId
                    )
                      ? 1
                      : openPlayerDetails!?.milestonesCompleted?.findIndex(
                          (value) => value?.questId == quest?.questId
                        )
                  ]?.milestonesCompleted
                ) - 1 || 0
              ]?.videos
          )?.map((video, videoIndex: number) => {
            const image = handleMedia(
              (
                openPlayerDetails?.videos?.find(
                  (vid) => Number(vid?.postId) == Number(video?.postId)
                )?.post?.metadata as VideoMetadata
              )?.video
            );
            const showMilestone =
              videoIndex === 0 ||
              (video as any)?.milestone !==
                (
                  quest?.milestones
                    ?.reduce(
                      (acc, obj) =>
                        acc.concat(
                          obj.videos?.map((item) => ({
                            ...item,
                            milestone: obj?.milestoneId,
                          })) as any
                        ),
                      []
                    )
                    ?.sort(
                      (a, b) =>
                        Number((a as any).milestone) -
                        Number((b as any).milestone)
                    )?.[videoIndex - 1] as any
                )?.milestone;

            return (
              <div
                className="relative w-full h-fit flex flex-col gap-2 items-start justify-start"
                key={videoIndex}
              >
                {player && showMilestone && (
                  <div className="relative w-full h-fit flex items-center justify-start text-center text-gray-500 font-bit text-xxs">
                    {dict?.mil} {(video as any)?.milestone}
                  </div>
                )}
                <div className="relative w-full h-fit flex flex-col sm:flex-row gap-4">
                  <div
                    className="relative w-fit h-fit flex rounded-md items-center justify-center p-px cursor-pointer"
                    id="rainbow"
                    onClick={() => {
                      context?.setRouterChangeLoading(true);

                      router.push(
                        `/video/${
                          openPlayerDetails?.videos?.find(
                            (vid) =>
                              Number(vid?.postId) == Number(video?.postId)
                          )?.post?.id
                        }`
                      );
                    }}
                  >
                    <div className="relative w-20 h-8 flex items-center justify-center rounded-md">
                      {image?.cover && (
                        <Image
                          layout="fill"
                          objectFit="cover"
                          draggable={false}
                          src={image?.cover}
                          className="rounded-md"
                        />
                      )}
                    </div>
                  </div>
                  <div className="relative w-full sm:w-px h-px sm:h-8 bg-gray-700"></div>
                  <PlayerValues
                    metrics={
                      openPlayerDetails?.videos?.find(
                        (vid) => Number(vid?.postId) == Number(video?.postId)
                      )!
                    }
                    text={dict?.mets}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayerMilestone;
