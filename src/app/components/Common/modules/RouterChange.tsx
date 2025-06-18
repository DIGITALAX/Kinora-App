import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";

const RouterChange: FunctionComponent = (): JSX.Element => {
  


  return (
    <div
      className="relative w-screen h-screen flex justify-center items-center bg-nave"
      id="game"
    >
      <div className="relative flex justify-center items-center flex-col gap-4">
        <div className="w-12 h-12 relative flex items-center justify-center animate-pulse">
          <Image
            width={60}
            height={60}
            priority
            draggable={false}
            src={`${INFURA_GATEWAY}/ipfs/QmbkoC8UbWJS49X6sxyBNfro8guEokUoT74KvaC6DfdmNg`}
          />
        </div>
      </div>
    </div>
  );
};

export default RouterChange;
