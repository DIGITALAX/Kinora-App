import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import Link from "next/link";
import numeral from "numeral";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { BioProps } from "../types/envoker.types";
import { ModalContext } from "@/app/providers";

const Bio: FunctionComponent<BioProps> = ({
  profile,
  dict,
  accountStats,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-row items-start justify-start">
      <div className="w-full h-fit items-start flex gap-3 flex-col sm:flex-row relative">
        <div className="relative flex items-start justify-between gap-2 w-full h-fit p-2 flex-col">
          {profile?.metadata?.bio && (
            <div className="font-vcr text-white text-xs text-xs w-fit h-fit relative flex break-words">
              {profile?.metadata?.bio}
            </div>
          )}
          <div className="relative w-full h-fit flex flex-row gap-10 justify-start items-center flex-wrap">
            {[
              {
                title: dict?.fr,
                image: "Qmb6fQG6L2R7Npf1oS55YEB5RS9z7oCyTwxYnTf57DEEjV",
                amount: accountStats?.graphFollowStats?.followers || 0,
              },
              {
                title: dict?.fl,
                image: "QmP141cw2U9TNsU6AXRoo5X5VCPawUTPkWAUJburJayg7x",
                amount: accountStats?.graphFollowStats?.following || 0,
              },
            ].map(
              (
                item: {
                  title: string;
                  image: string;
                  amount: number;
                },
                indexTwo: number
              ) => {
                return (
                  <div
                    className="font-vcr text-white text-xs w-fit h-fit relative items-start justify-center flex flex-col gap-2 break-words"
                    key={indexTwo}
                    title={item.title}
                  >
                    <div
                      className={`relative w-4 h-4 items-center justify-center flex`}
                    >
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                        draggable={false}
                      />
                    </div>

                    <div
                      className={`relative w-fit h-fit flex ${
                        item.amount > 0 && "cursor-pointer"
                      }`}
                      onClick={() =>
                        item.amount > 0 &&
                        context?.setFollowBox({
                          id: profile?.address,
                          type: item.title,
                        })
                      }
                    >
                      {numeral(item.amount).format("0a")}
                    </div>
                  </div>
                );
              }
            )}
            {profile?.metadata?.attributes?.find(
              (item) => item?.key === "location"
            )?.value && (
              <div className="font-vcr text-white text-xs w-fit h-fit relative items-start justify-center flex flex-col gap-2  break-words">
                <div className="relative w-4 h-4 items-center justify-center flex">
                  <Image
                    layout="fill"
                    draggable={false}
                    src={`${INFURA_GATEWAY}/ipfs/QmchHAtagS96zqoEL9BxrfHLNN1s7jUXJHiMLgzrcfMVpK`}
                  />
                </div>
                <div className="relative w-fit h-fit flex">
                  {
                    profile?.metadata?.attributes?.find(
                      (item) => item?.key === "location"
                    )?.value
                  }
                </div>
              </div>
            )}
            {profile?.metadata?.attributes?.find(
              (item) => item?.key === "website"
            )?.value && (
              <div className="font-vcr text-white text-xs w-fit max-w-full h-fit relative items-start justify-center flex flex-col gap-2  break-words">
                <div className="relative w-4 h-4 items-center justify-center flex">
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmPVS9QAg4HYCsAFgMnLA8ghd6j1WF6nMb2kbiReVcjRPn`}
                  />
                </div>
                <Link
                  target="blank"
                  rel="noreferrer"
                  href={
                    (profile?.metadata?.attributes
                      ?.find((item) => item?.key === "website")
                      ?.value?.includes("https://")
                      ? profile?.metadata?.attributes?.find(
                          (item) => item?.key === "website"
                        )?.value
                      : "https://" +
                        profile?.metadata?.attributes?.find(
                          (item) => item?.key === "website"
                        )?.value) || ""
                  }
                  className="relative break-all max-w-full w-fit h-fit flex cursor-pointer"
                >
                  {
                    profile?.metadata?.attributes?.find(
                      (item) => item?.key === "website"
                    )?.value
                  }
                </Link>
              </div>
            )}
          </div>
        </div>
        <div className="relative w-fit h-fit flex gap-3 mr-0">
          <div className="font-vcr text-xl text-white w-fit h-fit relative flex items-center justify-end break-all">
            {profile?.username?.localName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bio;
