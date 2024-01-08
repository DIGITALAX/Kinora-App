import PlayerValues from "@/components/Quest/modules/PlayerValues";
import { Player, Video } from "@/components/Quest/types/quest.types";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { PlayerMilestoneProps } from "../types/envoker.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { AiOutlineLoading } from "react-icons/ai";

const PlayerMilestone: FunctionComponent<PlayerMilestoneProps> = ({
  setOpenPlayerDetails,
  index,
  quest,
  openPlayerDetails,
  approvePlayerMilestone,
  approvalLoading,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-3">
      <div className="relative w-full h-fit flex overflow-x-scroll">
        <div className="relative w-fit h-fit flex flex-row gap-2">
          {quest?.players
            ?.filter(
              (player) => !player?.questsCompleted?.includes(quest?.questId)
            )?.length > 0 ?
            quest?.players
            ?.filter(
              (player) => !player?.questsCompleted?.includes(quest?.questId)
            )?.map((player: Player, playerIndex: number) => {
              const pfp = createProfilePicture(
                player?.profile?.metadata?.picture
              );
              return (
                <div
                  key={playerIndex}
                  className="relative rounded-full cursor-pointer p-px w-8 h-8"
                  id="northern"
                  onClick={() =>
                    setOpenPlayerDetails((prev) => {
                      const arr = [...prev];
                      arr[index] = arr?.[index] ? undefined : player;
                      return arr;
                    })
                  }
                >
                  <div className="relative w-full h-full rounded-full flex">
                    {pfp && (
                      <Image
                        src={pfp}
                        draggable={false}
                        layout="fill"
                        className="rounded-full"
                      />
                    )}
                  </div>
                </div>
              )
            }) :  <div className="relative w-full h-fit flex items-center justify-center text-center text-gray-500 font-bit text-xxs">No Active Players Yet.</div>}
        </div>
      </div>
      {openPlayerDetails?.[index] && (
        <div className="relative w-full h-fit flex flex-col gap-3">
          {quest?.milestones?.[
            Number(
              openPlayerDetails[index]?.milestonesCompleted?.[
                openPlayerDetails[index]?.milestonesCompleted?.findIndex(
                  (value) => value?.questId == quest?.questId
                ) == -1
                  ? 0
                  : openPlayerDetails[index]!?.milestonesCompleted?.findIndex(
                      (value) => value?.questId == quest?.questId
                    )
              ]?.milestonesCompleted
            ) - 1 || 0
          ]?.videos?.map((video: Video, videoIndex: number) => {
            return (
              <>
                {openPlayerDetails[index]?.videos?.find(
                  (vid) =>
                    Number(vid.pubId) == Number(video?.pubId) &&
                    Number(vid?.profileId) == Number(video?.profileId)
                ) && (
                  <div
                    className={`relative w-28 h-7 flex items-center bg-azul justify-center font-bit text-white text-xxs border border-white rounded-sm px-1.5 py-1 ${
                      openPlayerDetails[index]!?.eligibile?.[
                        openPlayerDetails[
                          index
                        ]?.milestonesCompleted?.findIndex(
                          (value) => value?.questId == quest?.questId
                        ) == -1
                          ? 0
                          : openPlayerDetails[
                              index
                            ]!?.milestonesCompleted?.findIndex(
                              (value) => value?.questId == quest?.questId
                            )
                      ]?.status || approvalLoading[index]
                        ? "opacity-70"
                        : "cursor-pointer active:scale-95 hover:opacity-70"
                    }`}
                    onClick={() =>
                      !openPlayerDetails[index]!?.eligibile?.[
                        openPlayerDetails[
                          index
                        ]?.milestonesCompleted?.findIndex(
                          (value) => value?.questId == quest?.questId
                        ) == -1
                          ? 0
                          : openPlayerDetails[
                              index
                            ]!?.milestonesCompleted?.findIndex(
                              (value) => value?.questId == quest?.questId
                            )
                      ]?.status &&
                      !approvalLoading[index] &&
                      approvePlayerMilestone(
                        Number(quest?.questId),
                        openPlayerDetails[
                          index
                        ]?.milestonesCompleted?.findIndex(
                          (value) => value?.questId == quest?.questId
                        ) == -1
                          ? 0
                          : openPlayerDetails[
                              index
                            ]!?.milestonesCompleted?.findIndex(
                              (value) => value?.questId == quest?.questId
                            ),
                        openPlayerDetails[index]!?.profile?.id,
                        index
                      )
                    }
                  >
                    <div
                      className={`relative w-fit h-fit flex items-center justify-center ${
                        approvalLoading[index] ? "animate-spin" : "top-px"
                      }`}
                    >
                      {approvalLoading[index] ? (
                        <AiOutlineLoading color="white" size={12} />
                      ) : (
                        "Verify Milestone"
                      )}
                    </div>
                  </div>
                )}
                <PlayerValues
                  key={videoIndex}
                  metrics={
                    openPlayerDetails[index]?.videos?.find(
                      (vid) =>
                        Number(vid.pubId) == Number(video?.pubId) &&
                        Number(vid?.profileId) == Number(video?.profileId)
                    )!
                  }
                  text="No Metrics Logged for this video yet."
                />
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlayerMilestone;
