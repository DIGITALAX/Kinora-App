"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import useFeed from "../hooks/useFeed";
import InfiniteScroll from "react-infinite-scroll-component";
import { Quest } from "../types/common.types";
import QuestPreview from "./QuestPreview";

export default function Entry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  const { feedLoading, questInfo, getMoreQuestFeed } = useFeed();

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
        {feedLoading || Number(context?.questFeed?.length) < 1 ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit md:flex-nowrap flex-wrap flex flex-row gap-3">
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
            <div className="w-full h-fit flex flex-col md:grid md:grid-cols-2 justify-center items-start gap-3 flex-wrap">
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
          <div className="relative w-full h-fit flex flex-col gap-3 lg:flex-nowrap flex-wrap">
            <div className="relative w-full h-fit flex flex-row gap-3 lg:flex-nowrap flex-wrap">
              {context?.questFeed
                ?.slice(0, 4)
                ?.map((item: Quest, index: number) => {
                  return (
                    <QuestPreview
                      key={index}
                      width="100%"
                      height="32rem"
                      quest={item}
                      dict={dict}
                      mainFeed={true}
                    />
                  );
                })}
            </div>
            <InfiniteScroll
              loader={<></>}
              hasMore={questInfo.hasMore}
              dataLength={context?.questFeed?.length!}
              next={getMoreQuestFeed}
              className="relative w-full h-fit flex-col items-center justify-start"
            >
              <div className="w-full h-fit flex flex-col md:grid md:grid-cols-2 justify-center items-start gap-3 flex-wrap pb-4">
                {context?.questFeed
                  ?.slice(4)

                  ?.map((item: Quest, index: number) => {
                    return (
                      <QuestPreview
                        key={index}
                        width="100%"
                        height="16rem"
                        quest={item}
                        mainFeed={true}
                        dict={dict}
                      />
                    );
                  })}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
}
