import QuestSwitch from "@/components/Envoke/modules/QuestSwitch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useEnvoke from "@/components/Envoke/hooks/useEnvoke";
import Stages from "@/components/Envoke/modules/Stages";

export default function Envoke() {
  const dispatch = useDispatch();
  const questInfo = useSelector(
    (state: RootState) => state.app.questInfoReducer
  );
  const questStage = useSelector(
    (state: RootState) => state.app.questStageReducer.value
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const {
    coverLoading,
    setCoverLoading,
    milestonesOpen,
    setMilestonesOpen,
    milestoneCoversLoading,
    setMilestoneCoversLoading,
    milestoneStage,
    setMilestoneStage,
  } = useEnvoke(dispatch, questInfo);
  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div className="relative w-fit h-fit flex items-start justify-start font-bit text-white text-xl pb-10">
          Envoke A New Quest
        </div>
        <div className="relative w-full h-full flex items-start justify-end flex-col md:flex-row gap-8">
          <QuestSwitch
            questStage={questStage}
            dispatch={dispatch}
            questInfo={questInfo}
            setCoverLoading={setCoverLoading}
            coverLoading={coverLoading}
            milestoneCoversLoading={milestoneCoversLoading}
            setMilestoneCoversLoading={setMilestoneCoversLoading}
            milestonesOpen={milestonesOpen}
            milestoneStage={milestoneStage}
          />
          <Stages
            questInfo={questInfo}
            questStage={questStage}
            dispatch={dispatch}
            milestonesOpen={milestonesOpen}
            setMilestonesOpen={setMilestonesOpen}
            milestoneStage={milestoneStage}
            setMilestoneStage={setMilestoneStage}
          />
        </div>
      </div>
    </div>
  );
}
