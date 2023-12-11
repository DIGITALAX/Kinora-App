import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import ConnectFirst from "@/components/Common/modules/ConnectFirst";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import useSignIn from "@/components/Layout/hooks/useSignIn";

export default function Upload() {
  const dispatch = useDispatch();
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const { handleLogIn, signLoading } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address
  );
  return (
    <>
      {walletConnected && lensConnected ? (
        <div
          className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end"
          style={{
            height: "calc(100vh - 5.5rem)",
          }}
        >
          <div
            className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col"
            style={{
              width: openSidebar
                ? "calc(100vw - 10rem)"
                : "calc(100vw - 2.5rem)",
            }}
            id={!openSidebar ? "closeSide" : ""}
          ></div>
        </div>
      ) : (
        <ConnectFirst
          signLoading={signLoading}
          openConnectModal={openConnectModal}
          handleLogIn={handleLogIn}
          walletConnected={walletConnected}
        />
      )}
    </>
  );
}
