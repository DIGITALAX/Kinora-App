"use client";

import { INFURA_GATEWAY } from "@/app/lib/constants";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";

const Footer: FunctionComponent = () => {
  const router = useRouter();
  return (
    <div className="fixed w-full h-10 bottom-0 bg-black flex flex-row items-center justify-center z-30">
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
                className="relative w-10 px-1 h-5 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => {
                  router.push("/");
                }}
              >
                <div className="flex relative w-full h-full">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/QmXTBvC2MVytxqjWfLAtyardgapxKzVi8uApTE5aEt1soc`}
                    layout="fill"
                    draggable={false}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Footer;
