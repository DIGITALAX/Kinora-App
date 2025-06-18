import {
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  VideoEligible,
  MilestoneEligibilityCriteria,
  QuestStage,
} from "../types/envoke.types";
import { ethers } from "ethers";
import { ModalContext } from "@/app/providers";
import { AccountType } from "../../Common/types/common.types";
import { custom, useAccount } from "wagmi";
import {
  IPFS_REGEX,
  KINORA_OPEN_ACTION,
  NFT_CREATOR,
} from "@/app/lib/constants";
import { chains } from "@lens-chain/sdk/viem";
import convertToFile from "@/app/lib/helpers/convertToFile";
import { VideoMetadata } from "@lens-protocol/client";
import { createPublicClient, createWalletClient, http } from "viem";
import getVideoCover from "@/app/lib/helpers/getVideoCover";
import handleQuestCheck from "@/app/lib/helpers/handleQuestCheck";
import { fetchPosts } from "@lens-protocol/client/actions";
import { Envoker } from "kinora-sdk";

fetchPosts;
const usePostLive = (
  dict: any,
  setMilestonesOpen: (e: SetStateAction<boolean[]>) => void,
  setMilestoneStage: (e: SetStateAction<number>) => void,
  setCollectionsSearch: (e: SetStateAction<string>) => void,
  questEnvoker: Envoker
) => {
  const context = useContext(ModalContext);
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const { address, isConnected } = useAccount();
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const [tokensToApprove, setTokensToApprove] = useState<
    {
      address: string;
      amount: string;
      approved: boolean;
    }[]
  >([]);

  const checkApproved = async () => {
    if (!isConnected || !context?.lensConectado?.profile) return;
    try {
      if (
        context?.questInfo?.milestones?.length < 1 ||
        context?.questInfo?.milestones?.filter((item) =>
          item?.rewards?.rewards20?.filter((item) => Number(item?.amount) > 0)
        )?.length < 1
      )
        return;

      const accumulatedRewards: Record<string, string> = {};

      (context?.questInfo?.milestones || [])?.forEach((milestone) => {
        (milestone?.rewards?.rewards20?.filter(Boolean) || [])?.forEach(
          (reward) => {
            if (accumulatedRewards[reward?.address]) {
              accumulatedRewards[reward?.address] = (
                BigInt(accumulatedRewards[reward?.address]) +
                BigInt(reward?.amount)
              ).toString();
            } else {
              accumulatedRewards[reward?.address] = (
                Number(reward?.amount) *
                10 ** 18
              ).toString();
            }
          }
        );
      });

      const rewardsArray = Object.entries(accumulatedRewards).map(
        ([address, amount]) => ({
          address,
          amount:
            Number(amount) *
            Number(context?.questInfo?.details?.maxPlayerCount),
        })
      );

      const newTokensToApprove = [];

      for (const reward of rewardsArray) {
        if (reward.address) {
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
            args: [address as `0x${string}`, KINORA_OPEN_ACTION],
            account: address,
          });

          const allowance = Number((data as any)?.toString());
          const requiredAmount = Number(reward.amount);
          if (allowance > requiredAmount) {
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
      }

      setTokensToApprove(newTokensToApprove);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleApprove = async (
    approveTokenAddress: `0x${string}`
  ): Promise<void> => {
    if (!context?.lensConectado?.profile) return;
    setPostLoading(true);
    try {
      let totalAmount = "0";

      context?.questInfo.milestones?.forEach((milestone) => {
        milestone.rewards.rewards20?.forEach((reward) => {
          if (
            reward.address?.toLowerCase() === approveTokenAddress.toLowerCase()
          ) {
            totalAmount = (
              Number(totalAmount) + Number(reward.amount)
            ).toString();
          }
        });
      });

      const clientWallet = createWalletClient({
        chain: chains.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: approveTokenAddress,
        abi: [
          {
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
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        args: [
          KINORA_OPEN_ACTION,
          BigInt(
            Number(totalAmount) *
              10 ** 18 *
              Number(context?.questInfo?.details?.maxPlayerCount)
          ) as bigint,
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
    if (!context?.isEnvoker) {
      context?.setSuccess({
        text: "Idea for a quest in this deployment? Send us a message!",
        image: "QmYTAxWEr9qm6p6R5GzRoRDJXBmC5bxMBpg3XZcPKqRNmp",
      });
      return;
    }
    if (!context?.lensConectado?.profile) return;
    if (!handleQuestCheck(context?.questInfo)) {
      context?.setMissingValues(true);
      return;
    }
    setPostLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        232
      );
      const signer = provider.getSigner();

      let cover: `ipfs://${string}` = context?.questInfo?.details
        ?.cover as `ipfs://${string}`;

      if (
        !context?.questInfo?.details?.cover?.includes("ipfs://") &&
        !IPFS_REGEX.test(context?.questInfo?.details?.cover)
      ) {
        const loadedCover = await fetch("/api/ipfs", {
          method: "POST",
          body: convertToFile(context?.questInfo?.details?.cover, "image/png"),
        });
        cover = "ipfs://" + (await loadedCover.json())?.cid;
      }

      const milestonePromises = await Promise.all(
        context?.questInfo.milestones?.map(async (item, index: number) => {
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
              erc721TokenURIs:
                item?.gated?.erc721TokenIds?.length > 0
                  ? [
                      (item?.gated?.erc721TokenIds || [])?.map(
                        (item) => item.uri
                      ) as `0x${string}`[],
                    ]?.filter(Boolean)
                  : [],
              erc721TokenIds: [],
              erc721Addresses:
                (item?.gated?.erc721TokenIds || [])
                  ?.map((item) => item?.uri)
                  ?.filter(Boolean)?.length > 0
                  ? [NFT_CREATOR]
                  : [],
              erc20Addresses:
                item?.gated?.erc20Addresses?.filter(Boolean)?.length > 0
                  ? item?.gated?.erc20Addresses?.filter(Boolean)
                  : [],
              erc20Thresholds: (item?.gated?.erc20Thresholds || [])
                ?.map((value, index) =>
                  (Number(value || 0) * 10 ** 18).toLocaleString("fullwide", {
                    useGrouping: false,
                  })
                )
                ?.filter(Boolean)
                ?.filter((item) => item !== "0"),
              oneOf: item?.gated?.oneOf,
            },
            milestone: index + 1,
            reward: [
              ...(item?.rewards?.rewards20 || [])
                ?.map((item) => ({
                  type: 0,
                  erc20tokenAddress: item?.address,
                  erc20tokenAmount: (
                    Number(item?.amount) *
                    10 ** 18
                  )?.toLocaleString("fullwide", { useGrouping: false }),
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
                        prompt: item?.details?.prompt,
                        mediaCover,
                        video,
                        audio,
                        images: [images],
                      }),
                    });
                    const res = await uriReward.json();

                    return {
                      type: 1,
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
              videoInfo: await Promise.all(
                (item?.eligibility || [])?.map(async (video) => {
                  let cover: `ipfs://${string}` = (
                    video?.video?.metadata as VideoMetadata
                  )?.video?.cover;

                  if (!cover) {
                    const file = await fetch("/api/ipfs", {
                      method: "POST",
                      body: convertToFile(
                        await getVideoCover(
                          (video?.video?.metadata as VideoMetadata)?.video?.item
                        ),
                        "image/png"
                      ),
                    });
                    cover = ("ipfs://" +
                      (await file.json()).cid) as `ipfs://${string}`;
                  }

                  return {
                    title: (((video?.video?.metadata as VideoMetadata)?.title
                      ?.toLowerCase()
                      ?.includes("video by") ||
                      (video?.video?.metadata as VideoMetadata)?.title
                        ?.toLowerCase()
                        ?.includes("post by")) &&
                    (video?.video?.metadata as VideoMetadata)?.content
                      ?.split("\n\n")?.[0]
                      ?.trim() !== ""
                      ? (
                          video?.video?.metadata as VideoMetadata
                        )?.content?.split("\n\n")?.[0]
                      : (video?.video?.metadata as VideoMetadata)
                          ?.title) as string,
                    description: (
                      video?.video?.metadata as VideoMetadata
                    )?.content?.split("\n\n")?.[0] as string,
                    cover,
                  };
                })
              ),
            },
            eligibility: {
              internalCriteria: await Promise.all(
                (item?.eligibility || [])?.map(
                  async (playbackCriteria: VideoEligible) => {
                    let assetWithPlaybackId = context?.allUploaded?.find(
                      (asset) =>
                        asset?.storage?.ipfs?.cid?.toLowerCase() ===
                          (
                            playbackCriteria?.video?.metadata as VideoMetadata
                          )?.video?.item
                            ?.split("ipfs://")?.[1]
                            ?.toLowerCase() ||
                        (asset as any)?.source.url
                          ?.split("ipfs://")?.[1]
                          ?.toLowerCase() ===
                          (
                            playbackCriteria?.video?.metadata as VideoMetadata
                          )?.video?.item
                            ?.split("ipfs://")?.[1]
                            ?.toLowerCase()
                    )?.playbackId;

                    if (!assetWithPlaybackId) {
                      const formData = new FormData();
                      formData.append(
                        "name",
                        ((playbackCriteria?.video?.metadata as VideoMetadata)
                          ?.title ??
                          (
                            playbackCriteria?.video?.metadata as VideoMetadata
                          )?.content?.split("\n\n")[0] ??
                          "") as string
                      );
                      formData.append(
                        "link",
                        (playbackCriteria?.video?.metadata as VideoMetadata)
                          ?.video?.item
                      );

                      const result = await fetch("/api/video", {
                        method: "POST",
                        body: formData,
                      });

                      assetWithPlaybackId = (await result.json())?.assetId;
                    }

                    const fields: (keyof MilestoneEligibilityCriteria)[] = [
                      "minPlayCount",
                      "minDuration",
                      "minAvd",
                      "minSecondaryQuoteOnQuote",
                      "minSecondaryMirrorOnQuote",
                      "minSecondaryReactOnQuote",
                      "minSecondaryCommentOnQuote",
                      "minSecondaryCollectOnQuote",
                      "minSecondaryQuoteOnComment",
                      "minSecondaryMirrorOnComment",
                      "minSecondaryReactOnComment",
                      "minSecondaryCommentOnComment",
                      "minSecondaryCollectOnComment",
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

                    fields?.forEach(
                      (field: keyof MilestoneEligibilityCriteria) => {
                        if (!(field in playbackCriteria.criteria)) {
                          (playbackCriteria.criteria as any)[field] =
                            field.startsWith("min") ? 0 : false;
                        }
                      }
                    );
                    return {
                      factoryIds: [],
                      playbackId: assetWithPlaybackId as string,
                      postId: playbackCriteria?.video?.id as `0x${string}`,
                      playbackCriteria: playbackCriteria.criteria,
                    };
                  }
                )
              ),
            },
          };
        })
      );

      const { error, errorMessage } = await questEnvoker.instantiateNewQuest({
        factoryId: 1,
        questDetails: {
          title: context?.questInfo.details.title,
          description: context?.questInfo.details.description,
          cover: (cover?.includes("ipfs://")
            ? cover
            : "ipfs://" + cover) as `ipfs://${string}`,
          tags: context?.questInfo?.details?.tags
            ?.split(",")
            ?.map((tag) => tag?.trim())
            ?.filter((tag) => tag.length > 0),
        },
        joinQuestTokenGatedLogic: {
          erc721TokenURIs:
            context?.questInfo.details?.gated?.erc721TokenIds?.length > 0
              ? [
                  (
                    context?.questInfo.details?.gated?.erc721TokenIds || []
                  )?.map((item) => item.uri) as `0x${string}`[],
                ]?.filter(Boolean)
              : [],
          erc721TokenIds: [],
          erc721Addresses:
            (context?.questInfo.details?.gated?.erc721TokenIds || [])
              ?.map((item) => item.uri)
              ?.filter(Boolean)?.length > 0
              ? [NFT_CREATOR]
              : [],
          erc20Addresses:
            context?.questInfo.details?.gated?.erc20Addresses?.filter(Boolean)
              ?.length > 0
              ? context?.questInfo.details?.gated?.erc20Addresses?.filter(
                  Boolean
                )
              : [],
          erc20Thresholds: (
            context?.questInfo.details?.gated?.erc20Thresholds || []
          )
            ?.map((value) =>
              (Number(value || 0) * 10 ** 18).toLocaleString("fullwide", {
                useGrouping: false,
              })
            )
            ?.filter(Boolean)
            ?.filter((item) => item !== "0") as string[],
          oneOf: context?.questInfo.details?.gated?.oneOf,
        },
        maxPlayerCount: context?.questInfo?.details?.maxPlayerCount,
        milestones: milestonePromises,
        wallet: signer as any,
        approveRewardTokens: false,
      });

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.error);
      } else {
        context?.setQuestInfo({
          details: {
            title: "",
            description: "",
            cover: "",
            tags: "",
            maxPlayerCount: 100,
            gated: {
              erc721Addresses: [],
              erc721TokenIds: [],
              erc20Addresses: [],
              erc20Thresholds: [],
              oneOf: true,
            },
          },
          milestones: [],
        });
        context?.setSuccess({
          image: "QmdzmfW6ikDzYMDYmkQMHMUfdZuqyFQPhzKL8ujPC7wxfj",
          text: "Your Quest is Live! You can keep track of player progress and approve rewards from your dashboard.",
        });
        setMilestonesOpen([true, false, false]);
        setMilestoneStage(0);
        setCollectionsSearch("");
        context?.setQuestStage(QuestStage.Details);
        context?.setAccountType(AccountType.Home);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  useEffect(() => {
    if (
      address &&
      Number(
        context?.questInfo?.milestones?.filter((item) =>
          item?.rewards?.rewards20?.filter((item) => Number(item?.amount) > 0)
        )?.length
      ) > 0
    ) {
      checkApproved();
    }
  }, [
    context?.questInfo?.milestones,
    context?.questInfo?.details?.maxPlayerCount,
  ]);

  return {
    handlePostLive,
    postLoading,
    tokensToApprove,
    handleApprove,
  };
};

export default usePostLive;
