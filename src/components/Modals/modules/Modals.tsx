import { FunctionComponent } from "react";
import Sidebar from "./Sidebar";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";

const Modals: FunctionComponent<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  return (
    <>
      <Sidebar
        router={router}
        openSidebar={openSidebar}
        lensConnected={lensConnected}
        dispatch={dispatch}
      />
    </>
  );
};

export default Modals;
