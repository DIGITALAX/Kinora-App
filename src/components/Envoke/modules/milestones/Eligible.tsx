import { FunctionComponent } from "react";
import { EligibleProps } from "../../types/envoke.types";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import createMedia from "../../../../../lib/helpers/createMedia";
import { setQuestInfo } from "../../../../../redux/reducers/questInfoSlice";

const Eligible: FunctionComponent<EligibleProps> = ({
  item,
  questInfo,
  dispatch,
  index,
  milestonesOpen,
}): JSX.Element => {
  const image = createMedia(item?.video?.metadata);
  return (
    <div className="relative w-full h-fit flex flex-col gap-5 items-start justify-start font-bit text-white">
      <div className="relative w-fit h-fit flex items-center justify-center text-sm">
        Video Eligibility Criteria
      </div>
      <div
        className="relative w-full h-72 p-px rounded-md flex items-center justify-center"
        id="rainbow"
      >
        <div className="relative w-full h-full relative rounded-md flex items-center justify-center">
          {image?.asset && (
            <MediaSwitch
              srcUrl={image?.asset}
              srcCover={image?.cover}
              classNameImage="rounded-md w-full h-full flex"
              classNameVideo="rounded-md object-cover flex w-full h-full items-center justify-center"
              type="video"
            />
          )}
        </div>
      </div>
      <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-4">
        {[
          {
            title: "Min. Average View Duration (mins)",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minAvd,
            input: true,
            function: (e: string) => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility,
              ];

              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  minAvd: Number(e),
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Min. Click Through Rate",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minCtr,
            input: true,
            function: (e: string) => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];

              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  minCtr: Number(e),
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Min. Total Times Played",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minPlayCount,
            input: true,
            function: (e: string) => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];

              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  minPlayCount: Number(e),
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Needs to Collect?",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.collectLens,
            input: true,
            function: (e: string) => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];

              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  collectLens:
                    eligibility[index].criteria.collectLens !== undefined
                      ? !eligibility[index].criteria.collectLens
                      : true,
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Needs to Quote?",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.quoteLens,
            input: false,
            function: () => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];
              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  quoteLens:
                    eligibility[index].criteria.quoteLens !== undefined
                      ? !eligibility[index].criteria.quoteLens
                      : true,
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Needs to Mirror?",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.mirrorLens,
            input: false,
            function: () => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];

              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  mirrorLens:
                    eligibility[index].criteria.mirrorLens !== undefined
                      ? !eligibility[index].criteria.mirrorLens
                      : true,
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Needs to Like?",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.likeLens,
            input: false,
            function: () => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];
              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  likeLens:
                    eligibility[index].criteria.likeLens !== undefined
                      ? !eligibility[index].criteria.likeLens
                      : true,
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Needs to Bookmark?",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.bookmarkLens,
            input: false,
            function: () => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];
              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  bookmarkLens:
                    eligibility[index].criteria.bookmarkLens !== undefined
                      ? !eligibility[index].criteria.bookmarkLens
                      : true,
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
          {
            title: "Needs to Comment?",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.commentLens,
            input: false,
            function: () => {
              const milestones = [...questInfo?.milestones];

              const eligibility = [
                ...(questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility || []),
              ];

              eligibility[index] = {
                ...eligibility[index],
                criteria: {
                  ...eligibility[index]?.criteria,
                  commentLens:
                    eligibility[index].criteria.commentLens !== undefined
                      ? !eligibility[index].criteria.commentLens
                      : true,
                },
              };

              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                eligibility,
              };

              dispatch(
                setQuestInfo({
                  actionDetails: questInfo?.details,
                  actionMilestones: milestones,
                  
                })
              );
            },
          },
        ]?.map(
          (
            item: {
              title: string;
              value: number | boolean | undefined;
              input: boolean;
              function: ((e: string) => void) | (() => void);
            },
            indexTwo: number
          ) => {
            return (
              <div
                key={indexTwo}
                className="relative w-fit h-fit items-start justify-start gap-2 font-bit text-white text-xxs flex flex-col"
              >
                <div className="flex items-start justify-start">
                  {item?.title}
                </div>
                <div className="relative w-fit h-fit flex items-start justify-start">
                  {item?.input ? (
                    <input
                      onChange={(e) => item?.function!(e.target.value)}
                      className="bg-black border border-white rounded-md px-1.5 py-1 h-8 w-full"
                      value={String(item?.value) || ""}
                      type="number"
                    />
                  ) : (
                    <div className="relative w-fit h-8 flex items-center justify-center rounded-md border border-white flex-row gap-1 text-xxs bg-black">
                      <div
                        className={`relative w-12 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
                          item?.value === true
                            ? "bg-verde text-black"
                            : "text-white"
                        }`}
                        onClick={() => (item.function as () => void)()}
                      >
                        yes
                      </div>
                      <div
                        className={`relative w-12 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
                          !item?.value ? "bg-verde text-black" : "text-white"
                        }`}
                        onClick={() => (item.function as () => void)()}
                      >
                        no
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default Eligible;
