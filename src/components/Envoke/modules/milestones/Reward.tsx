import { FunctionComponent } from "react";
import { ERC721Reward, RewardProps } from "../../types/envoke.types";
import Mint from "./Mint";
import Image from "next/legacy/image";
import { ACCEPTED_TOKENS_MUMBAI, INFURA_GATEWAY } from "../../../../../lib/constants";
import { setQuestInfo } from "../../../../../redux/reducers/questInfoSlice";
import { AiOutlineLoading } from "react-icons/ai";

const Reward: FunctionComponent<RewardProps> = ({
  questInfo,
  dispatch,
  milestonesOpen,
  balanceLoading,
  handleBalance,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-fit h-fit items-start justify-start opacity-70">
        Set Rewards for Milestone Completion.
      </div>
      <div className="relative w-full h-fit flex flex-col lg:flex-row gap-6 justify-start items-start">
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            NFT Reward
          </div>
          <div className="relative w-full h-fit flex items-start justify-start gap-1 flex-col">
            <div
              className="relative w-fit h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
              onClick={() => {
                const milestones = [...questInfo?.milestones];
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
                dispatch(
                  setQuestInfo({
                    actionDetails: questInfo?.details,
                    actionMilestones: milestones,
                  })
                );
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
                Add NFT Reward
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-col gap-3 max-h-[25rem] overflow-y-scroll">
            {questInfo?.milestones?.[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.rewards?.rewards721?.map((item: ERC721Reward, index: number) => {
              return (
                <Mint
                  questInfo={questInfo}
                  dispatch={dispatch}
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
            ERC20 Reward
          </div>
          <div className="relative flex flex-col w-full h-fit gap-4 items-start justify-start">
            {ACCEPTED_TOKENS_MUMBAI.map((item: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex flex-row  items-center justify-center gap-3 ${
                    questInfo?.milestones?.[
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
                      const milestones = [...questInfo?.milestones];

                      const rewards20 = [
                        ...(questInfo?.milestones?.[
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
                          rewards20: questInfo?.milestones?.[
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

                      dispatch(
                        setQuestInfo({
                          actionDetails: questInfo?.details,
                          actionMilestones: milestones,
                        })
                      );
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
                    {questInfo?.milestones?.[
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
                          questInfo?.milestones?.[
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
                        {questInfo?.milestones?.[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards?.rewards20?.[index]?.balance == false
                          ? "Insufficient Balance"
                          : "Sufficient Balance"}
                      </div>
                    )}
                    <input
                      value={
                        questInfo?.milestones?.[
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
                        const milestones = [...questInfo?.milestones];
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

                        dispatch(
                          setQuestInfo({
                            actionDetails: questInfo?.details,
                            actionMilestones: milestones,
                          })
                        );
                      }}
                      type="number"
                      className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
                      placeholder="Enter token reward amount."
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
                          "verify"
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
