import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Image from "next/legacy/image";
import createProfilePicture from "../../../lib/helpers/createProfilePicture";
import { NextRouter } from "next/router";
import AccountSwitch from "@/components/Envoker/modules/AccountSwitch";
import usePageProfile from "@/components/Envoker/hooks/usePageProfile";
import useSaves from "@/components/Envoker/hooks/useSaves";

export default function Handle({ router }: { router: NextRouter }) {
  const { handle } = router.query;
  const dispatch = useDispatch();
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const accountType = useSelector(
    (state: RootState) => state.app.accountSwitchReducer.value
  );
  const cover = createProfilePicture(lensConnected?.metadata?.coverPicture);
  const pfp = createProfilePicture(lensConnected?.metadata?.picture);
  const {
    profileLoading,
    pageProfile,
    questsLoading,
    setCompletedQuests,
    setLiveQuests,
    completedQuests,
    liveQuests,
  } = usePageProfile(handle as string, lensConnected);
  const { savesInfo, savesLoading, getMoreSaves, allSaves, setAllSaves } =
    useSaves(lensConnected, handle as string, accountType);
  return (
    <div
      className="relative overflow-y-scroll flex min-h-full w-full justify-end"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="h-fit p-2 relative flex flex-col gap-10"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div
          className={`relative w-full h-40 rounded-sm flex p-px ${
            profileLoading && "animate-pulse"
          }`}
          id="rainbow"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-sm">
            {cover && (
              <Image
                draggable={false}
                src={cover}
                className="rounded-sm"
                objectFit="cover"
                layout="fill"
              />
            )}
            <div className="absolute w-full h-full rounded-sm" id="negro"></div>
          </div>
          <div
            className="absolute w-20 h-20 right-4 bottom-4 rounded-full p-px"
            id="rainbow"
          >
            <div className="relative w-full h-full flex items-center justify-center rounded-full">
              {pfp && (
                <Image
                  draggable={false}
                  src={pfp}
                  objectFit="cover"
                  layout="fill"
                  className="rounded-full"
                />
              )}
            </div>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-3 justify-start items-start">
          <AccountSwitch
            lensConnected={lensConnected}
            pageProfile={pageProfile}
            savesInfo={savesInfo}
            savesLoading={savesLoading}
            getMoreSaves={getMoreSaves}
            accountType={accountType}
            dispatch={dispatch}
            setAllSaves={setAllSaves}
            setCompletedQuests={setCompletedQuests}
            setLiveQuests={setLiveQuests}
            liveQuests={liveQuests}
            completedQuests={completedQuests}
            questsLoading={questsLoading}
            allSaves={allSaves}
          />
        </div>
      </div>
    </div>
  );
}
