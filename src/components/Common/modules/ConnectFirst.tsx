import { FunctionComponent } from "react";
import { ConnectFirstProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const ConnectFirst: FunctionComponent<ConnectFirstProps> = ({
  openConnectModal,
  handleLogIn,
  signLoading,
  walletConnected,
}): JSX.Element => {
  return (
    <div
      className="relative flex items-center justify-center flex-col gap-3"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className={`relative w-12 h-12 flex items-center justify-center rounded-full p-px cursor-pointer ${
          signLoading && "animate-spin"
        }`}
        id="rainbow"
        onClick={!walletConnected ? openConnectModal : () => handleLogIn()}
      >
        <div className="relative w-full h-full rounded-full flex items-center justify-center">
          <Image
            draggable={false}
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/${
              !walletConnected
                ? "QmZ3oW66aBj5KChnBy91trqmdXpL4D23TGa8Ft1yr599R9"
                : "QmUwS9EKroeRNPPpiXj6FQcaWdsBHXZmBs7b43mzqoFHRs"
            }`}
            className="rounded-full"
            objectFit="cover"
          />
        </div>
      </div>
      <div className="relative font-bit text-white w-fit h-fit flex items-center justify-center">
        {!walletConnected ? "Connect" : "Lens Sign In"}
      </div>
    </div>
  );
};

export default ConnectFirst;
