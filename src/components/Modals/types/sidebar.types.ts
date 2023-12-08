import { NextRouter } from "next/router";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";

export type SidebarProps = {
  openSidebar: boolean;
  router: NextRouter;
  lensConnected: Profile | undefined;
  dispatch: Dispatch
};
