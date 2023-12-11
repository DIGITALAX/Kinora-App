import { FunctionComponent } from "react";
import Sidebar from "./Sidebar";
import { NextRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import Index from "./Indexer";
import InteractError from "./InteractError";

const Modals: FunctionComponent<{ router: NextRouter }> = ({
  router,
}): JSX.Element => {
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const indexer = useSelector((state: RootState) => state.app.indexerReducer);
  const interactError = useSelector(
    (state: RootState) => state.app.interactErrorReducer
  );
  const { handleLogIn } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address
  );
  return (
    <>
      <Sidebar
        router={router}
        openSidebar={openSidebar}
        lensConnected={lensConnected}
        dispatch={dispatch}
        walletConnected={walletConnected}
        handleLogIn={handleLogIn}
        openConnectModal={openConnectModal}
      />
      {indexer?.open && <Index message={indexer?.message!} />}
      {interactError?.value && <InteractError dispatch={dispatch} />}
    </>
  );
};

export default Modals;
