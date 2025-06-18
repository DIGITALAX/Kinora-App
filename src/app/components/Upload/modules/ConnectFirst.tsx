import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import useLens from "../../Common/hooks/useLens";
import { useAccount } from "wagmi";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useModal } from "connectkit";

const ConnectFirst: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const { isConnected, address } = useAccount();
  const { lensCargando, handleConectarse } = useLens(
    isConnected,
    address,
    dict
  );
  const { openOnboarding } = useModal();
  return (
    <div
      className="relative flex items-center justify-center flex-col gap-3"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className={`relative w-12 h-12 flex items-center justify-center rounded-full p-px cursor-pointer ${
          lensCargando && "animate-spin"
        }`}
        id="northern"
        onClick={() => (!isConnected ? openOnboarding() : handleConectarse())}
      >
        <div className="relative w-full h-full rounded-full flex items-center justify-center">
          <Image
            draggable={false}
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/${
              !isConnected
                ? "QmZ3oW66aBj5KChnBy91trqmdXpL4D23TGa8Ft1yr599R9"
                : "QmUwS9EKroeRNPPpiXj6FQcaWdsBHXZmBs7b43mzqoFHRs"
            }`}
            className="rounded-full"
            objectFit="cover"
          />
        </div>
      </div>
      <div className="relative font-bit text-white w-fit h-fit flex items-center justify-center">
        {!isConnected ? dict?.conn : dict?.lens}
      </div>
    </div>
  );
};

export default ConnectFirst;
