import { FunctionComponent, JSX, useContext } from "react";
import { BsShuffle } from "react-icons/bs";
import { AiOutlineLoading } from "react-icons/ai";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import {
  COVER_CONSTANTS,
  INFURA_GATEWAY,
  IPFS_REGEX,
} from "@/app/lib/constants";
import handleMediaUpload from "@/app/lib/helpers/handleMediaUpload";
import { MilestoneDetailsProps } from "../../types/envoke.types";

const MilestoneDetails: FunctionComponent<MilestoneDetailsProps> = ({
  milestoneCoversLoading,
  setMilestoneCoversLoading,
  milestonesOpen,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);

  return (
    <div className="relative font-bit text-white w-full h-fit flex items-start justify-start gap-2 flex-col">
      <div className="relative w-fit h-fit flex items-start justify-start">
        {dict?.milC}
      </div>
      <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2">
        <div
          className="relative w-6 h-6 flex items-center justify-center cursor-pointer rounded-full p-1 bg-black border border-acei active:scale-95"
          onClick={() => {
            const milestones = [...(context?.questInfo?.milestones || [])];
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

            context?.setQuestInfo((prev) => ({
              ...prev,
              milestones,
            }));
          }}
        >
          <div className="relative w-fit h-fit flex items-center justify-center">
            <BsShuffle size={10} color={"white"} />
          </div>
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center text-xxs opacity-70 break-all whitespace-preline">
          {dict?.shuff}
        </div>
      </div>
      <label
        className={`relative flex items-center w-full h-44 rounded-md justify-center cursor-pointer p-px`}
        id="northern"
      >
        <div className="relative w-full h-full flex items-center justify-center rounded-md">
          {milestoneCoversLoading?.[
            milestoneCoversLoading.findIndex((item: boolean) => item == true)
          ] ? (
            <div className="relative w-full rounded-md h-full flex items-center justify-center animate-spin">
              <AiOutlineLoading color="black" size={15} />
            </div>
          ) : (
            context?.questInfo?.milestones?.[
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
                    context?.questInfo?.milestones?.[
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
                        context?.questInfo?.milestones?.[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.details?.cover
                      }`
                    : context?.questInfo?.milestones?.[
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
                  const milestones = [
                    ...(context?.questInfo?.milestones || []),
                  ];
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

                  context?.setQuestInfo((prev) => ({
                    ...prev,
                    milestones,
                  }));
                }
              )
            }
          />
        </div>
      </label>
      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col pt-6">
        <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
          {dict?.tit} <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
        </div>
        <input
          className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
          placeholder={dict?.milT}
          value={
            context?.questInfo?.milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.details?.title || ""
          }
          onChange={(e) => {
            const milestones = [...(context?.questInfo?.milestones || [])];
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

            context?.setQuestInfo((prev) => ({
              ...prev,
              milestones,
            }));
          }}
        />
      </div>
      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col pt-4">
        <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
          {dict?.des} <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
        </div>
        <textarea
          className="h-32 w-full bg-black border border-acei rounded-md p-2 text-xs"
          style={{
            resize: "none",
          }}
          placeholder={dict?.milD}
          value={
            context?.questInfo?.milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.details?.description || ""
          }
          onChange={(e) => {
            const milestones = [...(context?.questInfo?.milestones || [])];
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

            context?.setQuestInfo((prev) => ({
              ...prev,
              milestones,
            }));
          }}
        ></textarea>
      </div>
    </div>
  );
};

export default MilestoneDetails;
