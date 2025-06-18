"use client";

import { useContext } from "react";
import { ModalContext } from "@/app/providers";

export default function NotFoundEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col"
        style={{
          width:
            typeof window !== "undefined" &&
            window.innerWidth > 684 &&
            context?.openSidebar
              ? "calc(100vw - 10rem)"
              : "calc(100vw - 2.5rem)",
        }}
        id={!context?.openSidebar ? "closeSide" : ""}
      >
        <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-sm">
          {dict?.lost}
        </div>
      </div>
    </div>
  );
}
