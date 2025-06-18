import { FunctionComponent, JSX, useContext } from "react";
import { AccountType } from "../../Common/types/common.types";
import Home from "./Home";
import Saves from "./Saves";
import Dashboard from "./Dashboard";
import { ModalContext } from "@/app/providers";
import { AccountSwitchProps } from "../types/envoker.types";

const AccountSwitch: FunctionComponent<AccountSwitchProps> = ({
  pageProfile,
  dict,
  questsLoading,
  quests,
  getMore,
  info,
  globalLoading,
  questEnvoker,
  kinoraDispatch,
}) => {
  const context = useContext(ModalContext);
  if (pageProfile?.address === context?.lensConectado?.profile?.address) {
    switch (context?.accountType) {
      case AccountType.Home:
        return (
          <Home
            dict={dict}
            questsLoading={questsLoading}
            getMore={getMore}
            quests={quests}
            info={info}
            globalLoading={globalLoading}
          />
        );

      case AccountType.Save:
        return (
          <Saves
            dict={dict}
            globalLoading={globalLoading}
            profile={pageProfile}
          />
        );

      case AccountType.Dashboard:
        return (
          <Dashboard
            questEnvoker={questEnvoker!}
            kinoraDispatch={kinoraDispatch!}
            allQuests={quests}
            dict={dict}
            info={info}
            getMore={getMore}
          />
        );
    }
  } else {
    return (
      <Home
        getMore={getMore}
        quests={quests}
        dict={dict}
        info={info}
        questsLoading={questsLoading}
        globalLoading={globalLoading}
      />
    );
  }
};

export default AccountSwitch;
