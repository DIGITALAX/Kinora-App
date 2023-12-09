import { FunctionComponent } from "react";
import { QuestDetails, QuestStage, StagesProps } from "../types/envoke.types";
import { IoIosArrowRoundForward, IoIosArrowRoundBack } from "react-icons/io";
import getStageArray from "../../../../lib/helpers/getStageArray";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { setQuestStage } from "../../../../redux/reducers/questStageSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const Stages: FunctionComponent<StagesProps> = ({
  questStage,
  dispatch,
  questInfo,
  milestonesOpen,
  setMilestonesOpen,
  milestoneStage,
  setMilestoneStage,
}): JSX.Element => {
  return (
    <div className="relative w-full lg:max-w-[20rem] h-full lg:h-5/6 flex flex-col border border-white rounded-md justify-between lg:top-20">
      <div className="relative w-full p-2 flex items-center justify-center text-white font-bit border-b border-white">
        {questStage}
      </div>
      <div
        className={`relative w-full flex flex-col p-4 gap-4 ${
          questStage == QuestStage.Details
            ? "justify-between items-center h-fit"
            : "items-start justify-start h-full"
        }`}
      >
        {getStageArray(questStage, questInfo?.milestones)?.map(
          (item: any, index: number) => {
            switch (questStage) {
              case QuestStage.Details:
                return (
                  <div
                    key={index}
                    className="relative w-fit h-fit flex items-center justify-center gap-1"
                  >
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {questInfo?.details?.[
                        item?.toLowerCase() as keyof QuestDetails
                      ]?.trim() !== "" ? (
                        <MdOutlineCheckBox color="#FE0000" size={20} />
                      ) : (
                        <MdOutlineCheckBoxOutlineBlank
                          color="#FE0000"
                          size={20}
                        />
                      )}
                    </div>
                    <div
                      className={`relative w-fit h-fit flex items-center justify-center text-white font-bit text-xs sm:text-base ${
                        questInfo?.details?.[
                          item?.toLowerCase() as keyof QuestDetails
                        ]?.trim() !== "" && "line-through"
                      }`}
                    >
                      {item}
                    </div>
                  </div>
                );

              case QuestStage.Milestones:
                return (
                  <div
                    key={index}
                    className="relative w-full h-fit flex items-start justify-start gap-1 flex-col"
                  >
                    <div
                      key={index}
                      className="relative w-fit h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
                      onClick={() =>
                        setMilestonesOpen((prev) => {
                          const arr = new Array(prev.length).fill(false);
                          arr[index] = !prev[index];
                          return arr;
                        })
                      }
                    >
                      <div className="relative text-white font-bit flex items-center justify-center">
                        Milestone {index + 1}
                      </div>
                      <div
                        className={`relative flex items-center justify-center w-3 h-1.5 ${
                          milestonesOpen?.[index] && "rotate-90"
                        }`}
                      >
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmW8oeGu3doJxd6e9fpoGzuZb6fSjKyu8BfXgtusNEWmjM`}
                          draggable={false}
                        />
                      </div>
                    </div>
                    {milestonesOpen?.[index] && (
                      <div className="pl-3 relative w-fit h-fit flex items-start justify-start flex-col gap-1.5">
                        {["Details", "Gates", "Reward", "Eligibility"].map(
                          (item: string, index: number) => {
                            return (
                              <div
                                key={index}
                                className={`relative w-fit h-fit flex items-center justify-center gap-1 cursor-pointer hover:opacity-70 ${
                                  milestoneStage == index
                                    ? "text-ligera"
                                    : "text-white"
                                }`}
                                onClick={() => setMilestoneStage(index)}
                              >
                                <div
                                  className={`relative flex items-center justify-center w-1.5 h-1 rotate-90 flip`}
                                >
                                  <Image
                                    layout="fill"
                                    src={`${INFURA_GATEWAY}/ipfs/QmW8oeGu3doJxd6e9fpoGzuZb6fSjKyu8BfXgtusNEWmjM`}
                                    draggable={false}
                                  />
                                </div>
                                <div
                                  className={`relative w-fit h-fit flex items-center justify-center font-bit text-xxs sm:text-sm`}
                                >
                                  {item}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    )}
                  </div>
                );

              case QuestStage.Encrypt:
                return <div key={index}></div>;

              case QuestStage.Post:
                return <div key={index}></div>;
            }
          }
        )}
      </div>
      <div className="relative w-full p-2 h-fit flex items-center justify-center text-white font-bit mb-0 flex-row gap-1 border-t border-white">
        {questStage !== QuestStage.Details && (
          <>
            <div
              className="relative w-full h-fit flex flex-row items-center justify-center cursor-pointer hover:opacity-70"
              onClick={() =>
                dispatch(
                  setQuestStage(
                    Object.values(QuestStage)[
                      (Object.values(QuestStage).indexOf(questStage) - 1) %
                        Object.values(QuestStage).length
                    ]
                  )
                )
              }
            >
              <div className="relative w-fit h-fit flex items-center justify-center">
                <IoIosArrowRoundBack color="white" size={15} />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center top-px">
                Back
              </div>
            </div>
            <div className="relative w-px h-full bg-white"></div>
          </>
        )}
        <div
          className="relative w-full h-fit flex flex-row items-center justify-center cursor-pointer hover:opacity-70"
          onClick={() =>
            dispatch(
              setQuestStage(
                Object.values(QuestStage)[
                  (Object.values(QuestStage).indexOf(questStage) + 1) %
                    Object.values(QuestStage).length
                ]
              )
            )
          }
        >
          <div className="relative w-fit h-fit flex items-center justify-center top-px">
            Next
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <IoIosArrowRoundForward color="white" size={15} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stages;
