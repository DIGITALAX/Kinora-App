import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { ACCEPTED_TOKENS, INFURA_GATEWAY, IPFS_REGEX } from "@/app/lib/constants";

const Details: FunctionComponent<{ dict: any }> = ({ dict }): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-fit h-fit items-start justify-start opacity-70">
        {dict?.story}
      </div>
      <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center">
        <div
          className={`relative flex items-center w-full h-44 rounded-md justify-center cursor-pointer p-px`}
          id="northern"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-md">
            <Image
              layout="fill"
              className="rounded-md"
              objectFit="cover"
              src={
                IPFS_REGEX.test(context?.questInfo?.details?.cover!)
                  ? `${INFURA_GATEWAY}/ipfs/${context?.questInfo?.details?.cover}`
                  : context?.questInfo?.details?.cover!
              }
              draggable={false}
            />
            <div className="absolute w-full h-full top-0 right-0 rounded-md bg-black/70"></div>
          </div>
          <div className="absolute left-3 bottom-3 w-fit h-fit flex items-center justify-center">
            {context?.questInfo?.details?.title}
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-start max-h-[10rem] overflow-y-scroll  whitespace-preline text-sm">
          {context?.questInfo?.details?.description}
        </div>
        <div className="relative w-full h-fit flex items-start justify-start flex-wrap text-xs gap-3">
          {context?.questInfo?.details?.tags
            ?.split(",")
            ?.map((item) => item?.trim())
            ?.filter((item) => item)
            ?.map((item: string, index: number) => {
              return (
                <div
                  className="relative w-fit h-fit rounded-md border border-white px-2 py-1.5 flex items-center justify-center text-black"
                  key={index}
                  style={{
                    backgroundColor: [
                      "#FE0000",
                      "#FE8000",
                      "#FED501",
                      "#FFFFFF",
                      "#0099FF",
                      "#7CDD00",
                    ]?.sort(() => 0.5 - Math.random())?.[0],
                  }}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {item}
                  </div>
                </div>
              );
            })}
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-6">
          <div className="relative underline underline-offset-4 text-base items-start justify-start flex">
            {dict?.gat}
          </div>
          {Number(context?.questInfo?.details?.gated?.erc721TokenIds?.length) >
            0 && (
            <div className="relative w-full h-fit flex flex-col gap-2">
              <div className="relative text-sm items-start justify-start flex">
                {dict?.tokG}
              </div>
              <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-5">
                {context?.questInfo?.details?.gated?.erc721TokenIds?.map(
                  (item, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-14 h-14 flex items-center hover:opacity-80 justify-center p-px rounded-md`}
                        id="northern"
                      >
                        <div className="relative w-full h-full relative rounded-md">
                          {(item?.metadata?.mediaCover ||
                            item?.metadata?.images?.[0]) && (
                            <Image
                              className={"rounded-md"}
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${
                                item?.metadata?.mediaCover
                                  ? item?.metadata?.mediaCover?.split(
                                      "ipfs://"
                                    )?.[1]
                                  : item?.metadata?.images?.[0]?.split(
                                      "ipfs://"
                                    )?.[1]
                              }`}
                              layout="fill"
                              objectFit="cover"
                            />
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
          {Number(context?.questInfo?.details?.gated?.erc20Addresses?.length) >
            0 && (
            <div className="relative w-full h-fit flex flex-col gap-2">
              <div className="relative text-base items-start justify-start flex text-sm">
                {dict?.tokGE}
              </div>
              <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-5">
                {context?.questInfo?.details?.gated?.erc20Addresses?.map(
                  (item: string, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-fit h-fit flex flex-row  items-center justify-center gap-2`}
                      >
                        <div
                          className={`relative w-fit h-fit rounded-full flex items-center active:scale-95`}
                          key={index}
                        >
                          <div className="relative w-7 h-8 flex items-center justify-center rounded-full">
                            <Image
                              src={`${INFURA_GATEWAY}/ipfs/${
                                ACCEPTED_TOKENS?.find(
                                  (value) => value[2] === item
                                )?.[0]
                              }`}
                              className="flex rounded-full"
                              draggable={false}
                              layout="fill"
                            />
                          </div>
                        </div>
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          <input
                            value={
                              context?.questInfo?.details?.gated
                                ?.erc20Thresholds?.[index] || ""
                            }
                            disabled
                            type="number"
                            className="h-10 w-20 px-2 bg-black border border-white rounded-md py-1 text-xs"
                          />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Details;
