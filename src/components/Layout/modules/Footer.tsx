import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { NextRouter } from "next/router";

const Footer: FunctionComponent<{ router: NextRouter }> = ({ router }) => {
  return (
    <div className="fixed w-full h-10 bottom-0 bg-black flex flex-row items-center justify-center">
      {[
        "#0F121A",
        "#FE0000",
        "#FE8000",
        "#FED501",
        "#FFFFFF",
        "#0099FF",
        "#7CDD00",
      ].map((backgroundColor: string, index: number) => {
        return (
          <div
            key={index}
            className="relative w-full h-full items-center justify-center flex"
            style={{ backgroundColor }}
          >
            {index == 0 && (
              <div
                className="relative w-10 h-5 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => router.push("/")}
              >
                <Image
                  src={`${INFURA_GATEWAY}/ipfs/QmXTBvC2MVytxqjWfLAtyardgapxKzVi8uApTE5aEt1soc`}
                  layout="fill"
                  draggable={false}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Footer;
