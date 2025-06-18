import { FunctionComponent, JSX, useContext } from "react";
import { ERC721Reward, RewardProps } from "../../types/envoke.types";
import Mint from "./Mint";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";

const Reward: FunctionComponent<RewardProps> = ({
  milestonesOpen,
  balanceLoading,
  handleBalance,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);

  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-fit h-fit items-start justify-start opacity-70">
        {dict?.comp}
      </div>
      <div className="relative w-full h-fit flex flex-col lg:flex-row gap-6 justify-start items-start">
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            {dict?.reN}
          </div>
          <div className="relative w-full h-fit flex items-start justify-start gap-1 flex-col">
            <div
              className="relative w-fit h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
              onClick={() => {
                const milestones = [...(context?.questInfo?.milestones || [])];
                milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ] = {
                  ...milestones[
                    milestonesOpen.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        )
                      : 0
                  ],
                  rewards: {
                    ...milestones[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.rewards,
                    rewards721:
                      milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.rewards?.rewards721?.length < 1
                        ? [
                            {
                              details: {
                                title: "",
                                description: "",
                                prompt: "",
                                mediaCover: "",
                                video: "",
                                audio: "",
                                images: [],
                                media: "static",
                                open: true,
                              },
                            },
                          ]
                        : [
                            ...(
                              milestones[
                                milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ]?.rewards?.rewards721 || []
                            )?.map((item) => {
                              return {
                                ...item,
                                details: {
                                  ...item?.details,
                                  open: false,
                                },
                              };
                            }),
                            {
                              details: {
                                title: "",
                                description: "",
                                prompt: "",
                                mediaCover: "",
                                video: "",
                                audio: "",
                                images: [],
                                media: "static",
                                open: true,
                              },
                            },
                          ],
                  },
                };
                context?.setQuestInfo((prev) => ({
                  ...prev,
                  milestones,
                }));
              }}
            >
              <div
                className={`relative flex items-center justify-center w-3 h-2.5`}
              >
                <Image
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmYPNwx7ptMnkZPWUBaxuzoWBDKPiZmc9Crbm3GRAHZD1N`}
                  draggable={false}
                />
              </div>
              <div className="relative text-white font-bit flex items-center justify-center top-px">
                {dict?.reNA}
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-col gap-3 sm:max-h-[25rem] overflow-y-scroll">
            {context?.questInfo?.milestones?.[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.rewards?.rewards721?.map((item: ERC721Reward, index: number) => {
              return (
                <Mint
                  dict={dict}
                  item={item?.details}
                  key={index}
                  milestonesOpen={milestonesOpen}
                  index={index}
                />
              );
            })}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            {dict?.re20}
          </div>
          <div className="relative flex flex-col w-full h-fit gap-4 items-start justify-start">
            {ACCEPTED_TOKENS.map((item: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex flex-col sm:flex-row  items-center justify-center gap-3 ${
                    context?.questInfo?.milestones?.[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.rewards?.rewards20?.filter(
                      (value) => value?.address == item[2]
                    )?.[0]
                      ? "opacity-100"
                      : "opacity-50"
                  }`}
                >
                  <div
                    className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95`}
                    onClick={() => {
                      const milestones = [
                        ...(context?.questInfo?.milestones || []),
                      ];

                      const rewards20 = [
                        ...(context?.questInfo?.milestones?.[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards?.rewards20 || []),
                      ];

                      rewards20[index] = {
                        address: item?.[2] as `0x${string}`,
                        amount:
                          rewards20[index]?.amount?.trim() == ""
                            ? rewards20[index]?.amount
                            : "0",
                        balance: undefined,
                      };

                      milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ] = {
                        ...milestones[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ],
                        rewards: {
                          ...milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.rewards,
                          rewards20: context?.questInfo?.milestones?.[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.rewards?.rewards20?.filter(
                            (value) => value?.address == item[2]
                          )?.[0]
                            ? milestones[
                                milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ]?.rewards?.rewards20?.filter(
                                (address) =>
                                  address?.address?.toLowerCase() !==
                                  item?.[2]?.toLowerCase()
                              )
                            : rewards20,
                        },
                      };

                      context?.setQuestInfo((prev) => ({
                        ...prev,
                        milestones,
                      }));
                    }}
                  >
                    <div className="relative w-7 h-8 flex items-center justify-center rounded-full">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                        className="flex rounded-full"
                        draggable={false}
                        layout="fill"
                      />
                    </div>
                  </div>
                  <div className="relative w-20 h-fit flex items-center justify-center">
                    {item[1]}
                  </div>
                  <div className="relative w-full h-fit flex items-center justify-center flex-col gap-1">
                    {context?.questInfo?.milestones?.[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.rewards?.rewards20?.[index]?.balance !== undefined && (
                      <div
                        className={`relative w-full h-fit flex font-bit items-start justify-start text-xxs ${
                          context?.questInfo?.milestones?.[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.rewards?.rewards20?.[index]?.balance == false
                            ? "text-rojo"
                            : "text-white"
                        }`}
                      >
                        {context?.questInfo?.milestones?.[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards?.rewards20?.[index]?.balance == false
                          ? dict?.balI
                          : dict?.balS}
                      </div>
                    )}
                    <input
                      value={
                        context?.questInfo?.milestones?.[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards?.rewards20?.[index]?.amount || ""
                      }
                      onChange={async (e) => {
                        const milestones = [
                          ...(context?.questInfo?.milestones || []),
                        ];
                        const tokens = [
                          ...(milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.rewards?.rewards20 || []),
                        ];

                        tokens[index] = {
                          ...tokens[index],
                          amount: e.target.value,
                          balance: undefined,
                        };
                        milestones[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ] = {
                          ...milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ],
                          rewards: {
                            ...milestones[
                              milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.rewards,
                            rewards20: tokens,
                          },
                        };

                        context?.setQuestInfo((prev) => ({
                          ...prev,
                          milestones,
                        }));
                      }}
                      type="number"
                      className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
                      placeholder={dict?.amR}
                    />
                    <div
                      className="absolute w-14 bg-black px-1.5 py-1 h-7 font-bit text-white hover:opacity-70 flex items-center justify-center right-2 cursor-pointer border border-acei text-xxs rounded-md active:scale-95 bottom-1.5"
                      onClick={() =>
                        handleBalance(
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0,
                          index
                        )
                      }
                    >
                      <div
                        className={`relative w-fit h-fit flex items-center justify-center ${
                          balanceLoading?.[index] && "animate-spin"
                        }`}
                      >
                        {balanceLoading?.[index] ? (
                          <AiOutlineLoading color={"white"} size={15} />
                        ) : (
                          dict?.ver
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reward;
