import { NextRouter } from "next/router";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";

export type SidebarProps = {
  openSidebar: boolean;
  router: NextRouter;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  walletConnected: boolean;
  openConnectModal: (() => void) | undefined;
  handleLogIn: () => Promise<void>;
};

export type IndexProps = {
  message: string;
};

export type InteractErrorProps = {
  dispatch: Dispatch;
};
