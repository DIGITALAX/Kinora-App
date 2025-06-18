"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import useActivity from "../hooks/useActivity";
import Activity from "./Activity";

export default function ActivityEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  const { activityLoading, getMoreActivityFeed, activityInfo } = useActivity();

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
        {activityLoading ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-row gap-3">
              {Array.from({ length: 4 })?.map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 sm:h-96 flex rounded-sm animate-pulse"
                    id="northern"
                  ></div>
                );
              })}
            </div>
            <div className="w-full h-fit grid-cols-1 sm:grid-cols-2 grid gap-3">
              {Array.from({ length: 10 }).map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 flex rounded-sm animate-pulse"
                    id="northern"
                  ></div>
                );
              })}
            </div>
          </div>
        ) : (
          <Activity
            dict={dict}
            getMoreActivityFeed={getMoreActivityFeed}
            activityInfo={activityInfo}
          />
        )}
      </div>
    </div>
  );
}
