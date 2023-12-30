import { useEffect, useState } from "react";
import { Dispatch } from "redux";
import {
  QuestInfoState,
  setQuestInfo,
} from "../../../../redux/reducers/questInfoSlice";
import { Envoker } from "kinora-sdk";
import { apolloClient } from "../../../../lib/lens/client";
import { Asset } from "@livepeer/react";
import { VideoMetadataV3 } from "../../../../graphql/generated";
import {
  Milestone,
  VideoEligible,
  MilestoneEligibilityCriteria,
  RewardType,
} from "../types/envoke.types";
import { convertIPFS } from "../../../../lib/helpers/convertIPFS";
import { ethers } from "ethers";
import convertToFile from "../../../../lib/helpers/convertToFile";
import {
  IPFS_REGEX,
  KINORA_ESCROW_CONTRACT,
  PRINT_DESIGN_DATA,
} from "../../../../lib/constants";
import { setSuccess } from "../../../../redux/reducers/successSlice";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygonMumbai } from "viem/chains";

const usePostLive = (
  dispatch: Dispatch,
  questInfo: QuestInfoState,
  address: `0x${string}` | undefined,
  publicClient: PublicClient
) => {
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [allUploaded, setAllUploaded] = useState<Asset[]>([]);
  const [tokensToApprove, setTokensToApprove] = useState<
    {
      address: string;
      amount: string;
      approved: boolean;
    }[]
  >([]);
  const questEnvoker = new Envoker({
    authedApolloClient: apolloClient,
  });

  const handleUploadAssets = async () => {
    try {
      const data = await fetch("/api/livepeer", {
        method: "POST",
      });

      const res = await data.json();
      setAllUploaded(res.json);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkApproved = async () => {
    try {
      console.log(
        questInfo?.milestones?.map(
          (item) => item?.rewards?.rewards20?.length > 0
        )?.length
      );
      if (
        questInfo?.milestones?.length < 1 ||
        questInfo?.milestones?.filter((item) =>
          item?.rewards?.rewards20?.filter((item) => Number(item?.amount) > 0)
        )?.length < 1
      )
        return;

      const accumulatedRewards: Record<string, string> = {};

      (questInfo.milestones || [])?.forEach((milestone) => {
        (milestone.rewards.rewards20 || [])?.forEach((reward) => {
          if (accumulatedRewards[reward.address]) {
            accumulatedRewards[reward.address] = (
              BigInt(accumulatedRewards[reward.address]) + BigInt(reward.amount)
            ).toString();
          } else {
            accumulatedRewards[reward.address] = (
              Number(reward.amount) *
              10 ** 18
            ).toString();
          }
        });
      });

      const rewardsArray = Object.entries(accumulatedRewards).map(
        ([address, amount]) => ({
          address,
          amount,
        })
      );

      const newTokensToApprove = [];

      for (const reward of rewardsArray) {
        const data = await publicClient.readContract({
          address: reward.address as `0x${string}`,
          abi: [
            {
              inputs: [
                {
                  internalType: "address",
                  name: "owner",
                  type: "address",
                },
                {
                  internalType: "address",
                  name: "spender",
                  type: "address",
                },
              ],
              name: "allowance",
              outputs: [
                {
                  internalType: "uint256",
                  name: "",
                  type: "uint256",
                },
              ],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: "allowance",
          args: [address as `0x${string}`, KINORA_ESCROW_CONTRACT],
          account: address,
        });

        const allowance = Number((data as any)?.toString());
        const requiredAmount = Number(reward.amount);
        if (allowance >= requiredAmount) {
          newTokensToApprove.push({
            address: reward.address,
            amount: requiredAmount.toString(),
            approved: true,
          });
        } else {
          newTokensToApprove.push({
            address: reward.address,
            amount: requiredAmount.toString(),
            approved: false,
          });
        }
      }

      setTokensToApprove(newTokensToApprove);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleApprove = async (
    approveTokenAddress: `0x${string}`
  ): Promise<void> => {
    setPostLoading(true);
    try {
      let totalAmount = "0";

      questInfo.milestones.forEach((milestone) => {
        milestone.rewards.rewards20.forEach((reward) => {
          if (
            reward.address?.toLowerCase() === approveTokenAddress.toLowerCase()
          ) {
            totalAmount = (
              BigInt(totalAmount) + BigInt(reward.amount)
            ).toString();
          }
        });
      });

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: approveTokenAddress,
        abi: [
          approveTokenAddress === "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
            ? {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "tokens",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              }
            : approveTokenAddress ===
              "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
            ? {
                constant: false,
                inputs: [
                  { name: "guy", type: "address" },
                  { name: "wad", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
              }
            : {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
        ],
        functionName: "approve",
        args: [
          KINORA_ESCROW_CONTRACT,
          BigInt(Number(totalAmount) * 10 ** 18) as bigint,
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setTokensToApprove((prevTokens) =>
        prevTokens.map((token) =>
          token.address.toLowerCase() === approveTokenAddress.toLowerCase()
            ? { ...token, amount: totalAmount, approved: true }
            : token
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  const handlePostLive = async () => {
    setPostLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        80001
      );
      const signer = provider.getSigner();

      let cover: `ipfs://${string}` = questInfo?.details
        ?.cover as `ipfs://${string}`;

      if (
        !questInfo?.details?.cover?.includes("ipfs://") &&
        !IPFS_REGEX.test(questInfo?.details?.cover)
      ) {
        const loadedCover = await fetch("/api/ipfs", {
          method: "POST",
          body: convertToFile(questInfo?.details?.cover, "image/png"),
        });
        cover = "ipfs://" + (await loadedCover.json())?.cid;
      }

      const milestonePromises = await Promise.all(
        questInfo.milestones?.map(async (item: Milestone, index: number) => {
          let cover: string = item.details?.cover;

          if (
            !item.details?.cover?.includes("ipfs://") &&
            !IPFS_REGEX.test(item.details?.cover)
          ) {
            const milestoneCover = await fetch("/api/ipfs", {
              method: "POST",
              body: convertToFile(item.details?.cover, "image/png"),
            });
            cover = (await milestoneCover.json())?.cid;
          }

          return {
            gated: {
              erc721TokenURIs: [
                (item?.gated?.erc721TokenIds || [])?.map(
                  (item) => item.uri
                ) as `0x${string}`[],
              ]?.filter(Boolean),
              erc721TokenIds: [],
              erc721Addresses:
                [
                  (item?.gated?.erc721TokenIds || [])?.map(
                    (item) => item.uri
                  ) as `0x${string}`[],
                ]?.filter(Boolean)?.length > 0
                  ? [PRINT_DESIGN_DATA]
                  : [],
              erc20Addresses: item?.gated?.erc20Addresses,
              erc20Thresholds: (item?.gated?.erc20Thresholds || [])?.map(
                (item) => String(Number(item) * 10 ** 18)
              ),
              oneOf: item?.gated?.oneOf,
            },
            milestone: index + 1,
            reward: [
              ...(item?.rewards?.rewards20 || [])
                ?.map((item) => ({
                  type: 0 as RewardType,
                  erc20tokenAddress: item?.address,
                  erc20tokenAmount: String(Number(item?.amount) * 10 ** 18),
                }))
                .filter(Boolean),
              ...(await Promise.all(
                (item?.rewards?.rewards721 || [])
                  ?.map(async (item) => {
                    let video = item?.details?.video;
                    let audio = item?.details?.audio;
                    let images = item?.details?.images?.[0];
                    let mediaCover = item?.details?.mediaCover;
                    if (video) {
                      const file = await fetch("/api/ipfs", {
                        method: "POST",
                        body: convertToFile(video, "video/mp4"),
                      });
                      video = "ipfs://" + (await file.json()).cid;
                    }

                    if (audio) {
                      const file = await fetch("/api/ipfs", {
                        method: "POST",
                        body: convertToFile(audio, "audio/mpeg"),
                      });
                      audio = "ipfs://" + (await file.json()).cid;
                    }

                    if (mediaCover) {
                      const file = await fetch("/api/ipfs", {
                        method: "POST",
                        body: convertToFile(mediaCover, "image/png"),
                      });
                      mediaCover = "ipfs://" + (await file.json()).cid;
                    }

                    if (images) {
                      const file = await fetch("/api/ipfs", {
                        method: "POST",
                        body: convertToFile(images, "image/png"),
                      });
                      images = "ipfs://" + (await file.json()).cid;
                    }

                    const uriReward = await fetch("/api/ipfs", {
                      method: "POST",
                      body: JSON.stringify({
                        title: item?.details?.title,
                        description: item?.details?.description,
                        mediaType: item?.details?.media,
                        mediaCover,
                        video,
                        audio,
                        images: [images],
                      }),
                    });
                    const res = await uriReward.json();

                    return {
                      type: 1 as RewardType,
                      erc721URI: (`ipfs://` + res.cid) as `ipfs://${string}`,
                    };
                  })
                  .filter(Boolean)
              )),
            ],
            details: {
              title: item.details.title,
              cover: ("ipfs://" + cover) as `ipfs://${string}`,
              description: item.details.description,
            },
            eligibility: {
              internalCriteria: await Promise.all(
                (item?.eligibility || [])?.map(
                  async (playbackCriteria: VideoEligible) => {
                    let assetWithPlaybackId = allUploaded.find((asset) =>
                      asset?.hash?.some(
                        (h) =>
                          h?.hash?.toLowerCase() ===
                          (
                            playbackCriteria?.video?.metadata as VideoMetadataV3
                          )?.asset?.video?.raw?.uri
                            ?.split("ipfs://")?.[1]
                            ?.toLowerCase()
                      )
                    );

                    // if (!assetWithPlaybackId?.hash) {
                    //   const file = await convertIPFS(
                    //     (item?.video?.metadata as VideoMetadataV3)?.asset?.video
                    //       ?.optimized?.uri ||
                    //       (item?.video?.metadata as VideoMetadataV3)?.asset?.video
                    //         ?.raw?.uri
                    //   );

                    //   console.log({file})

                    //   const formData = new FormData();
                    //   formData.append(
                    //     "name",
                    //     (item?.video?.metadata as VideoMetadataV3)?.title
                    //       ? (item?.video?.metadata as VideoMetadataV3)?.title
                    //       : (
                    //           item?.video?.metadata as VideoMetadataV3
                    //         )?.content?.split("\n\n")[0]
                    //   );
                    //   formData.append("file", file as Blob);
                    //   const result = await fetch("/api/video", {
                    //     method: "POST",
                    //     body: formData,
                    //   });

                    //   assetWithPlaybackId = await result.json();

                    //   console.log({ assetWithPlaybackId });
                    // }

                    const fields: (keyof MilestoneEligibilityCriteria)[] = [
                      "minPlayCount",
                      "minCtr",
                      "minAvd",
                      "minImpressionCount",
                      "minEngagementRate",
                      "minDuration",
                      "quote",
                      "mirror",
                      "comment",
                      "bookmark",
                      "react",
                    ];

                    if (
                      !playbackCriteria.criteria ||
                      typeof playbackCriteria.criteria !== "object"
                    ) {
                      playbackCriteria.criteria = {};
                    } else {
                      const descriptor = Object.getOwnPropertyDescriptor(
                        playbackCriteria,
                        "criteria"
                      );
                      if (descriptor && !descriptor.writable) {
                        const newCriteria = { ...playbackCriteria.criteria };
                        playbackCriteria = {
                          ...playbackCriteria,
                          criteria: newCriteria,
                        };
                      }
                    }

                    fields.forEach(
                      (field: keyof MilestoneEligibilityCriteria) => {
                        if (!(field in playbackCriteria.criteria)) {
                          (playbackCriteria.criteria as any)[field] =
                            field.startsWith("min") ? 0 : false;
                        }
                      }
                    );

                    return {
                      playbackId:
                        (assetWithPlaybackId?.playbackId as string) || "",
                      postId: playbackCriteria?.video?.id as string,
                      playbackCriteria: playbackCriteria.criteria,
                    };
                  }
                )
              ),
            },
          };
        })
      );

      await questEnvoker.instantiateNewQuest({
        questDetails: {
          title: questInfo.details.title,
          description: questInfo.details.description,
          cover: cover as `ipfs://${string}`,
          tags: questInfo?.details?.tags
            ?.split(",")
            ?.map((tag) => tag?.trim())
            ?.filter((tag) => tag.length > 0),
        },
        joinQuestTokenGatedLogic: {
          erc721TokenURIs: [
            (questInfo.details?.gated?.erc721TokenIds || [])?.map(
              (item) => item.uri
            ) as `0x${string}`[],
          ]?.filter(Boolean),
          erc721TokenIds: [],
          erc721Addresses:
            [
              (questInfo.details?.gated?.erc721TokenIds || [])?.map(
                (item) => item.uri
              ) as `0x${string}`[],
            ]?.filter(Boolean)?.length > 0
              ? [PRINT_DESIGN_DATA]
              : [],
          erc20Addresses:
            questInfo.details?.gated?.erc20Addresses?.filter(Boolean),
          erc20Thresholds: (questInfo.details?.gated?.erc20Thresholds || [])
            ?.map((item) => String(Number(item) * 10 ** 18))
            ?.filter(Boolean),
          oneOf: questInfo.details?.gated?.oneOf,
        },
        maxPlayerCount: questInfo.details.maxPlayerCount,
        milestones: milestonePromises,
        wallet: signer as unknown as ethers.Wallet,
        approveRewardTokens: false,
      });

      // dispatch(
      //   setQuestInfo({
      //     actionDetails: {
      //       title: "",
      //       description: "",
      //       cover: "",
      //       tags: "",
      //       maxPlayerCount: 100,
      //     },
      //     actionMilestones: [],
      //   })
      // );
      // dispatch(setSuccess(true));
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  useEffect(() => {
    if (allUploaded?.length < 1) {
      handleUploadAssets();
    }
  }, []);

  useEffect(() => {
    if (
      address &&
      questInfo?.milestones?.filter((item) =>
        item?.rewards?.rewards20?.filter((item) => Number(item?.amount) > 0)
      )?.length > 0
    ) {
      checkApproved();
    }
  }, [questInfo?.milestones]);

  return {
    handlePostLive,
    postLoading,
    tokensToApprove,
    handleApprove,
  };
};

export default usePostLive;

// {
//   questDetails: {
//     cover: "ipfs://QmWF2rPYcJJQQbq9cCS2Vgzs1ZWRsakF1Rk5tbDP1wbU2u",
//     title: "dsf",
//     description: "asdfsadf",
//   },
//   maxPlayerCount: 100,
//   milestones: [
//     {
//       gated: {
//         erc721TokenURIs: [
//           [
//             "ipfs://QmPs78ezRnRzXu5pnD3zkeSWfFHuYS2bwS7pBpu7y9tS9a",
//             "ipfs://QmcdAXfprAtwjWnYcjWFf2u4N34GRuEzkbyEffDZKq5ncj",
//           ],
//         ],
//         erc721TokenIds: [[]],
//         erc721Addresses: ["0x062aA8B94a308fE84bE7974bAC758bC574145907"],
//         erc20Addresses: [],
//         erc20Thresholds: [],
//         oneOf: true,
//       },
//       milestone: 1,
//       reward: [
//         {
//           type: 0,
//           erc20tokenAddress: "0x92ee85a0aa39df75634c143ae298a91cc8ecfe7c",
//           erc20tokenAmount: "1",
//         },
//         {
//           type: 1,
//           erc721URI:
//             "ipfs://QmWxQo9TnUaSEo6fj1mdbHs6qnRtsTJrHfhsVkGykYiz8G",
//         },
//       ],
//       details: {
//         title: "ten tedn",
//         cover: "ipfs://QmbuV5vN2AQxPeUxGnyVxLtkrvpTnrAAFoA5pUiQAkCxFm",
//         description: "sasfadsf",
//       },
//       eligibility: {
//         internalCriteria: [
//           {
//             playbackId: "",
//             postId: "0x01c6a9-0x44",
//             playbackCriteria: {
//               minPlayCount: 100,
//               minCtr: 100,
//               minAvd: 100,
//               minImpressionCount: 100,
//               minEngagementRate: 100,
//               minDuration: 100,
//               quote: true,
//               mirror: true,
//               comment: true,
//               bookmark: true,
//               react: true,
//             },
//           },
//         ],
//       },
//     },
//     {
//       gated: {
//         erc721TokenURIs: [
//           ["ipfs://QmPs78ezRnRzXu5pnD3zkeSWfFHuYS2bwS7pBpu7y9tS9a"],
//         ],
//         erc721TokenIds: [],
//         erc721Addresses: ["0x062aA8B94a308fE84bE7974bAC758bC574145907"],
//         erc20Thresholds: [],
//         erc20Addresses: [],
//         oneOf: true,
//       },
//       milestone: 2,
//       reward: [
//         {
//           type: 0,
//           erc20tokenAddress: "0x92ee85a0aa39df75634c143ae298a91cc8ecfe7c",
//           erc20tokenAmount: "1",
//         },
//       ],
//       details: {
//         title: "adf",
//         cover: "ipfs://QmNjiLqrkh1BWz53aSkJ11eSGdrhWtg4ELXHMH3iRWcbmR",
//         description: "sdafdasfdsafdas",
//       },
//       eligibility: {
//         internalCriteria: [
//           {
//             playbackId: "",
//             postId: "0x01c6a9-0x43",
//             playbackCriteria: {
//               minPlayCount: 100,
//               minCtr: 100,
//               minAvd: 100,
//               minImpressionCount: 100,
//               minEngagementRate: 100,
//               minDuration: 100,
//               quote: true,
//               mirror: true,
//               comment: true,
//               bookmark: true,
//               react: true,
//             },
//           },
//         ],
//       },
//     },
//   ],
//   joinQuestTokenGatedLogic: {
//     erc721TokenURIs: [
//       ["ipfs://QmPs78ezRnRzXu5pnD3zkeSWfFHuYS2bwS7pBpu7y9tS9a"],
//     ],
//     erc721TokenIds: [],
//     erc721Addresses: ["0x062aA8B94a308fE84bE7974bAC758bC574145907"],
//     erc20Addresses: [],
//     erc20Thresholds: [],
//     oneOf: true,
//   },
//   wallet: signer as unknown as ethers.Wallet,
//   approveRewardTokens: true,
// }
