import { useState } from "react";
import { Dispatch } from "redux";
import {
  QuestInfoState,
  setQuestInfo,
} from "../../../../redux/reducers/questInfoSlice";
import { Envoker, MilestoneEligibilityCriteria, RewardType } from "kinora-sdk";
import { apolloClient } from "../../../../lib/lens/client";
import { Address, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import convertToFile from "../../../../lib/helpers/convertToFile";
import { PRINT_DESIGN_DATA } from "../../../../lib/constants";

const usePostLive = (dispatch: Dispatch, questInfo: QuestInfoState) => {
  const [postLoading, setPostLoading] = useState<boolean>(false);
  const questEnvoker = new Envoker({
    authedApolloClient: apolloClient,
  });

  const handlePostLive = async () => {
    setPostLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const loadedCover = await fetch("/api/ipfs", {
        method: "POST",
        body: convertToFile(questInfo?.details?.cover, "image/png"),
      });
      const res = await loadedCover.json();

      const milestonePromises = questInfo.milestones.map(
        async (item, index: number) => {
          const milestoneCover = await fetch("/api/ipfs", {
            method: "POST",
            body: convertToFile(item.details?.cover, "image/png"),
          });
          const res = await milestoneCover.json();
          return {
            gated: {
              erc721TokenIds: [
                {
                  uris: item?.gated?.erc721TokenIds.map(
                    (item) => item.uri
                  ) as `0x${string}`[],
                  ids: [],
                  matchType: 0,
                },
              ],
              erc721Addresses: [PRINT_DESIGN_DATA],
              erc20Addresses: item?.gated?.erc20Addresses,
              erc20Thresholds: item?.gated?.erc20Thresholds.map((item) =>
                String(item)
              ),
              oneOf: item?.gated?.oneOf,
            },
            milestone: index + 1,
            reward: [
              ...item?.rewards?.rewards20
                ?.map((item) => ({
                  type: 0 as RewardType,
                  erc20tokenAddress: item?.address,
                  erc20tokenAmount: String(Number(item?.amount) * 10 ** 18),
                }))
                .filter(Boolean),
              ...(await Promise.all(
                item?.rewards?.rewards721
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
              cover: ("ipfs://" + res?.cid) as `ipfs://${string}`,
              description: item.details.description,
            },
            eligibility: {
              internalCriteria: item?.eligibility?.map((item) => ({
                playbackId: item?.playbackId as string,
                postId: item?.video?.id as string,
                playbackCriteria:
                  item?.criteria as MilestoneEligibilityCriteria,
              })),
            },
          };
        }
      );

      await questEnvoker.instantiateNewQuest({
        questDetails: {
          cover: ("ipfs://" + res?.cid) as `ipfs://${string}`,
          title: questInfo?.details?.title,
          description: questInfo?.details?.description,
        },
        maxPlayerCount: questInfo?.details?.maxPlayerCount,
        milestones: await Promise.all(milestonePromises),
        joinQuestTokenGatedLogic: {
          erc721TokenIds: [
            {
              uris: questInfo?.details?.gated?.erc721TokenIds.map(
                (item) => item.uri
              ),
              ids: [],
              matchType: 0,
            },
          ],
          erc721Addresses: [PRINT_DESIGN_DATA],
          erc20Addresses: questInfo?.details?.gated?.erc20Addresses,
          erc20Thresholds: questInfo?.details?.gated?.erc20Thresholds.map(
            (item) => String(item)
          ),
          oneOf: questInfo?.details?.gated?.oneOf,
        },
        wallet: {
          ...clientWallet,
          getAddress: async (): Promise<Address> => {
            const addresses = await clientWallet.getAddresses();
            return addresses?.[0] ?? "default-address-or-null";
          },

          signMessage: async (message: string): Promise<string> => {
            const account = (await clientWallet.getAddresses())?.[0];
            if (!account) {
              throw new Error("No account found for signing");
            }
            return clientWallet.signMessage({ account, message });
          },
        } as any,
      });

      dispatch(
        setQuestInfo({
          actionDetails: {
            title: "",
            description: "",
            cover: "",
            tags: "",
            maxPlayerCount: 100,
          },
          actionMilestones: [],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  return {
    handlePostLive,
    postLoading,
  };
};

export default usePostLive;
