import { FunctionComponent } from "react";
import { EligibleProps } from "../../types/envoke.types";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import createMedia from "../../../../../lib/helpers/createMedia";
import { setQuestInfo } from "../../../../../redux/reducers/questInfoSlice";
import { ImCross } from "react-icons/im";

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
        id="northern"
      >
        <div className="absolute top-2 right-2 flex items-center justify-center w-fit h-fit">
          <div
            className="relative w-5 h-5 border border-acei flex items-center justify-center rounded-full p-1 bg-black cursor-pointer active:scale-95 z-20"
            onClick={() => {
              let milestones = [...questInfo?.milestones];

              const eligibility = [
                ...milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.eligibility
                  ?.filter((_, i) => i !== index)
                  ?.filter(Boolean),
              ];

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
            }}
          >
            <ImCross color={"white"} size={8} />
          </div>
        </div>
        <div className="relative w-full h-full relative rounded-md flex items-center justify-center">
          {image?.asset && (
            <MediaSwitch
              srcUrl={image?.asset}
              srcCover={image?.cover}
              classNameImage="rounded-md w-full h-full flex"
              classNameVideo={{
                objectFit: "cover",
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                justifyItems: "center",
                borderRadius: "0.375rem",
                position: "relative",
                zIndex: "0",
              }}
              type="video"
              postId=""
            />
          )}
        </div>
      </div>
      <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-4">
        {[
          {
            title: "Min. Average View Duration (secs)",
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
            title: "Min. Total Duration Watched (secs)",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minDuration,
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
                  minDuration: Number(e),
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
            title: "Min. Quotes On Quote",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryQuoteOnQuote,
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
                  minSecondaryQuoteOnQuote: Number(e),
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
            title: "Min. Comments On Quote",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryCommentOnQuote,
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
                  minSecondaryCommentOnQuote: Number(e),
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
            title: "Min. Mirrors On Quote",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryMirrorOnQuote,
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
                  minSecondaryMirrorOnQuote: Number(e),
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
            title: "Min. Reacts On Quote",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryReactOnQuote,
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
                  minSecondaryReactOnQuote: Number(e),
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
            title: "Min. Collects On Quote",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryCollectOnQuote,
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
                  minSecondaryCollectOnQuote: Number(e),
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
            title: "Min. Quotes On Comment",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryQuoteOnComment,
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
                  minSecondaryQuoteOnComment: Number(e),
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
            title: "Min. Comments On Comment",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryCommentOnComment,
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
                  minSecondaryCommentOnComment: Number(e),
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
            title: "Min. Mirrors On Comment",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryMirrorOnComment,
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
                  minSecondaryMirrorOnComment: Number(e),
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
            title: "Min. Reacts On Comment",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryReactOnComment,
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
                  minSecondaryReactOnComment: Number(e),
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
            title: "Min. Collects On Comment",
            value:
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility?.[index]?.criteria?.minSecondaryCollectOnComment,
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
                  minSecondaryCollectOnComment: Number(e),
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
              ]?.eligibility?.[index]?.criteria?.quote,
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
                  quote:
                    eligibility[index].criteria.quote !== undefined
                      ? !eligibility[index].criteria.quote
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
              ]?.eligibility?.[index]?.criteria?.mirror,
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
                  mirror:
                    eligibility[index].criteria.mirror !== undefined
                      ? !eligibility[index].criteria.mirror
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
              ]?.eligibility?.[index]?.criteria?.react,
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
                  react:
                    eligibility[index].criteria.react !== undefined
                      ? !eligibility[index].criteria.react
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
              ]?.eligibility?.[index]?.criteria?.bookmark,
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
                  bookmark:
                    eligibility[index].criteria.bookmark !== undefined
                      ? !eligibility[index].criteria.bookmark
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
              ]?.eligibility?.[index]?.criteria?.comment,
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
                  comment:
                    eligibility[index].criteria.comment !== undefined
                      ? !eligibility[index].criteria.comment
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
                      className="bg-black border border-acei rounded-md px-1.5 py-1 h-8 w-full"
                      value={String(item?.value) || ""}
                      type="number"
                    />
                  ) : (
                    <div className="relative w-fit h-8 flex items-center justify-center rounded-md border border-acei flex-row gap-1 text-xxs bg-black">
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
