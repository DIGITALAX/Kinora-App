import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "../hooks/useSignIn";
import { useAccount } from "wagmi";
import { NextRouter } from "next/router";

const Header: FunctionComponent<{ router: NextRouter }> = ({ router }) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const profilePicture = createProfilePicture(lensConnected?.metadata?.picture);
  const {
    handleLogIn,
    handleLogOut,
    setAccountOpen,
    signLoading,
    accountOpen,
  } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address
  );
  return (
    <div className="relative h-fit flex items-center justify-end flex-row w-full z-10">
      <div
        className="relative flex flex-row justify-between flex items-center p-2"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <input
          className="relative w-3/4 h-8 rounded-full px-2 py-1 text-white font-bit text-xs bg-nave border border-white/80"
          placeholder="SEARCH"
        />
        <div className="relative flex items-center justify-center gap-5">
          <div className="relative w-4 h-6 flex items-center justify-center">
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmUhHCKqhK31MYdo8aMAFcZZn1CCFfe4Z5ywTWzVfhuTDX`}
            />
          </div>
          <div className="relative w-4 h-6 flex items-center justify-center">
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmcvuX3d75RQC8zxFbmuaJJjhB6ZYiKfoXR7f74n6Ro2EJ`}
            />
          </div>
          <div
            className={`relative w-7 h-7 flex items-center justify-center rounded-full p-px cursor-pointer ${
              signLoading && "animate-spin"
            }`}
            id="rainbow"
            onClick={
              !walletConnected
                ? openConnectModal
                : walletConnected && !lensConnected?.id
                ? () => handleLogIn()
                : () => setAccountOpen(!accountOpen)
            }
          >
            <div className="relative w-full h-full rounded-full flex items-center justify-center">
              {!walletConnected || !lensConnected?.id ? (
                <Image
                  draggable={false}
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    !walletConnected
                      ? "QmZ3oW66aBj5KChnBy91trqmdXpL4D23TGa8Ft1yr599R9"
                      : walletConnected &&
                        !lensConnected?.id &&
                        "QmUwS9EKroeRNPPpiXj6FQcaWdsBHXZmBs7b43mzqoFHRs"
                  }`}
                  className="rounded-full"
                  objectFit="cover"
                />
              ) : (
                profilePicture && (
                  <Image
                    draggable={false}
                    layout="fill"
                    src={profilePicture}
                    className="rounded-full"
                    objectFit="cover"
                  />
                )
              )}
            </div>
          </div>
        </div>
        {accountOpen && (
          <div className="absolute top-12 right-3 border border-white bg-offBlack flex flex-col items-center justify-center font-bit text-white text-xs h-fit w-28">
            <div
              className="relative w-full h-full flex items-center justify-center cursor-pointer hover:opacity-80 py-1.5 px-2.5"
              onClick={() => {
                handleLogOut();
                setAccountOpen(false);
              }}
            >
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Header;
