import { FunctionComponent } from "react";
import { MilestoneDetailsProps } from "../../types/envoke.types";
import { BsShuffle } from "react-icons/bs";
import { setQuestInfo } from "../../../../../redux/reducers/questInfoSlice";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import {
  COVER_CONSTANTS,
  INFURA_GATEWAY,
  IPFS_REGEX,
} from "../../../../../lib/constants";
import handleMediaUpload from "../../../../../lib/helpers/handleMediaUpload";

const MilestoneDetails: FunctionComponent<MilestoneDetailsProps> = ({
  questInfo,
  dispatch,
  milestoneCoversLoading,
  setMilestoneCoversLoading,
  milestonesOpen,
}): JSX.Element => {
  return (
    <div className="relative font-bit text-white w-full h-fit flex items-start justify-start gap-2 flex-col">
      <div className="relative w-fit h-fit flex items-start justify-start">
        Milestone Cover Image
      </div>
      <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2">
        <div
          className="relative w-6 h-6 flex items-center justify-center cursor-pointer rounded-full p-1 bg-black border border-white active:scale-95"
          onClick={() => {
            const milestones = [...questInfo?.milestones];
            milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ] = {
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ],
              details: {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.details,
                cover: COVER_CONSTANTS.sort(() => 0.5 - Math.random())[0],
              },
            };

            dispatch(
              setQuestInfo({
                actionDetails: questInfo?.details,
                actionMilestones: milestones,
                
              })
            );
          }}
        >
          <div className="relative w-fit h-fit flex items-center justify-center">
            <BsShuffle size={10} color={"white"} />
          </div>
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center text-xxs opacity-70">
          Don&apos;t have a cover image? <br /> Shuffle here.
        </div>
      </div>
      <label
        className={`relative flex items-center w-full h-44 rounded-md justify-center cursor-pointer p-px`}
        id="rainbow"
      >
        <div className="relative w-full h-full flex items-center justify-center rounded-md">
          {milestoneCoversLoading?.[
            milestoneCoversLoading.findIndex((item: boolean) => item == true)
          ] ? (
            <div className="relative w-full rounded-md h-full flex items-center justify-center animate-spin">
              <AiOutlineLoading color="black" size={15} />
            </div>
          ) : (
            questInfo?.milestones?.[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.details?.cover && (
              <Image
                layout="fill"
                className="rounded-md"
                objectFit="cover"
                src={
                  IPFS_REGEX.test(
                    questInfo?.milestones?.[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.details?.cover
                  )
                    ? `${INFURA_GATEWAY}/ipfs/${
                        questInfo?.milestones?.[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.details?.cover
                      }`
                    : questInfo?.milestones?.[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.details?.cover
                }
                draggable={false}
              />
            )
          )}
          <input
            hidden
            type="file"
            accept={"image/png, image/gif"}
            multiple={true}
            onChange={(e) =>
              e?.target?.files?.[0] &&
              handleMediaUpload(
                e,
                () =>
                  setMilestoneCoversLoading((prev) => {
                    const arr = [...prev];
                    arr[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ] = true;
                    return arr;
                  }),
                () =>
                  setMilestoneCoversLoading((prev) => {
                    const arr = [...prev];
                    arr[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ] = false;
                    return arr;
                  }),
                (cover: string) => {
                  const milestones = [...questInfo?.milestones];
                  milestones[
                    milestonesOpen.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        )
                      : 0
                  ] = {
                    ...milestones[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ],
                    details: {
                      ...milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.details,
                      cover,
                    },
                  };

                  dispatch(
                    setQuestInfo({
                      actionDetails: questInfo?.details,
                      actionMilestones: milestones,
                      
                    })
                  );
                }
              )
            }
          />
        </div>
      </label>
      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
        <div className="relative w-fit h-fit flex items-start justify-start">
          Milestone Title
        </div>
        <input
          className="h-10 w-full bg-black border border-white rounded-md p-1 text-xs"
          placeholder="Give your Milestone a title."
          value={
            questInfo?.milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.details?.title
          }
          onChange={(e) => {
            const milestones = [...questInfo?.milestones];
            milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ] = {
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ],
              details: {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.details,
                title: e.target.value,
              },
            };

            dispatch(
              setQuestInfo({
                actionDetails: questInfo?.details,
                actionMilestones: milestones,
                
              })
            );
          }}
        />
      </div>
      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
        <div className="relative w-fit h-fit flex items-start justify-start">
          Milestone Description
        </div>
        <textarea
          className="h-32 w-full bg-black border border-white rounded-md p-2 text-xs"
          style={{
            resize: "none",
          }}
          placeholder="A short overview of this milestone and what it involves."
          value={
            questInfo?.milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.details?.description
          }
          onChange={(e) => {
            const milestones = [...questInfo?.milestones];
            milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ] = {
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ],
              details: {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.details,
                description: e.target.value,
              },
            };

            dispatch(
              setQuestInfo({
                actionDetails: questInfo?.details,
                actionMilestones: milestones,
                
              })
            );
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default MilestoneDetails;
