import { useContext, useEffect, useState } from "react";
import { createPublicClient, http } from "viem";
import { Dispatch } from "kinora-sdk";
import { ethers } from "ethers";
import { ModalContext } from "@/app/providers";
import { SocialType } from "../../Video/types/video.types";
import { Quest } from "../../Common/types/common.types";
import { useAccount } from "wagmi";
import { getQuest } from "../../../../../graphql/getQuest";
import checkGates from "@/app/lib/helpers/checkGates";
import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import { getCollectionURI } from "../../../../../graphql/getAllCollections";
import { chains } from "@lens-chain/sdk/viem";
import {
  fetchAccountsAvailable,
  fetchPost,
} from "@lens-protocol/client/actions";
import { Post } from "@lens-protocol/client";

const useJoin = (questId: string, dict: any, kinoraDispatch: Dispatch) => {
  const { address } = useAccount();
  const context = useContext(ModalContext);
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const [questInfoLoading, setQuestInfoLoading] = useState<boolean>(false);
  const [completeLoading, setCompleteLoading] = useState<boolean>(false);
  const [questInfo, setQuestInfo] = useState<Quest | undefined>();
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const [mainViewer, setMainViewer] = useState<number>(0);
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  const [socialType, setSocialType] = useState<SocialType>(SocialType.Players);

  const handleCompleteMilestone = async (questCompleted: boolean) => {
    if (!address || !context?.lensConectado?.profile) return;
    setCompleteLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        232
      );
      const signer = provider.getSigner();

      const { error } = await kinoraDispatch.playerCompleteQuestMilestone(
        questId as `0x${string}`,
        signer as any
      );

      if (error) {
        context?.setModalOpen(dict?.error);
      } else {
        context?.setSuccess({
          image: questInfo?.milestones?.[
            mainViewer - 1
          ]?.milestoneMetadata?.cover?.includes("ipfs://")
            ? questInfo?.milestones?.[
                mainViewer - 1
              ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
            : questInfo?.milestones?.[mainViewer - 1]?.milestoneMetadata
                ?.cover!,
          text: questCompleted
            ? "Quest Completed! You've leveled up. Ready for the next one?"
            : `Milestone ${mainViewer} Completed! See all your rewards in the dashboard.`,
        });
        await getQuestInfo();
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCompleteLoading(false);
  };

  const handlePlayerJoin = async () => {
    if (!address || !context?.lensConectado?.profile) return;
    setJoinLoading(true);
    try {
      const data = await checkGates(questInfo?.gate!, publicClient, address);

      if (
        (data?.erc20 && data?.erc20?.length > 0) ||
        (data?.erc721 && data?.erc721?.length > 0)
      ) {
        setJoinLoading(false);
        context?.setQuestGates({
          erc20: data?.erc20,
          erc721: data?.erc721,
          oneOf: questInfo?.gate?.oneOf,
        });
        return;
      }

      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        232
      );
      const signer = provider.getSigner();

      const { error, errorMessage } = await kinoraDispatch.playerJoinQuest(
        questId as `0x${string}`,
        signer as any
      );

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.error);
      } else {
        context?.setSuccess({
          image: questInfo?.questMetadata?.cover?.includes("ipfs://")
            ? questInfo?.questMetadata?.cover?.split("ipfs://")?.[1]
            : questInfo?.questMetadata?.cover!,
          text: "Quest accepted! Keep up with your stats in every video.",
        });
        await getQuestInfo();
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setJoinLoading(false);
  };

  const getQuestInfo = async () => {
    setQuestInfoLoading(true);
    try {
      const data = await getQuest(questId);

      if (data) {
        const questInstantiateds = data?.data?.questInstantiateds || [];
        const promises = questInstantiateds.map(async (item: any) => {
          let post: Post | undefined;
          const res = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (res?.isOk()) {
            post = res?.value as Post;
          }

          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          const uris = item?.gate?.erc721Logic?.[0]?.uris || [];
          const updated721sPromises = uris?.map(async (erc721: any) => {
            const collection = await getCollectionURI(erc721);
            return collection?.data?.collectionCreateds?.[0];
          });

          const erc721Logic = await Promise.all(updated721sPromises);

          const milestones = item?.milestones || [];
          const newMilestonesPromises = milestones.map(
            async (milestone: any) => {
              const erc721Logics = milestone?.gated?.erc721Logic || [];
              let erc721LogicPromises = erc721Logics.flatMap((logic: any) => {
                const logicUris = logic?.uris || [];
                return logicUris.map(async (erc721: any) => {
                  const collection = await getCollectionURI(erc721);
                  return collection?.data?.collectionCreateds?.[0];
                });
              });

              if (!milestone?.milestoneMetadata) {
                let data = await fetchIPFSJSON(milestone?.uri);
                milestone = {
                  ...milestone,
                  milestoneMetadata: data,
                };
              }

              const erc721Logic = await Promise.all(erc721LogicPromises);

              const videoPromises = milestone?.videos?.map(
                async (
                  video: {
                    postId: string;
                    minAVD: string;
                    minDuration: string;
                  },
                  i: number
                ) => {
                  let post: Post | undefined;
                  const res = await fetchPost(
                    context?.lensConectado?.sessionClient ??
                      context?.clienteLens!,
                    {
                      post: video?.postId,
                    }
                  );

                  if (res?.isOk()) {
                    post = res?.value as Post;
                  }

                  return {
                    ...video,
                    details: milestone?.milestoneMetadata?.videoCovers?.[i],
                    minAVD: (Number(video?.minAVD) / 10 ** 18).toFixed(18),
                    minDuration: (Number(video?.minDuration) / 10 ** 18).toFixed(18),
                    post,
                  };
                }
              );

              const videos = await Promise.all(videoPromises);

              const rewardPromises = milestone?.rewards?.map(
                async (item: any) => {
                  if (item.type == "1") {
                    if (!item?.rewardMetadata) {
                      const fetched = await fetchIPFSJSON(item?.uri);
                      return {
                        ...item,
                        rewardMetadata: fetched,
                      };
                    } else {
                      return item;
                    }
                  } else {
                    return item;
                  }
                }
              );

              const rewards = await Promise.all(rewardPromises);

              return {
                ...milestone,
                videos,
                rewards,
                gated: {
                  ...milestone?.gated,
                  erc721Logic,
                },
              };
            }
          );

          const newMilestones = await Promise.all(newMilestonesPromises);

          const newPlayerPromises = (item?.players || [])?.map(
            async (player: { playerProfile: string }) => {
              let profile;
              const data = await fetchAccountsAvailable(
                context?.lensConectado?.sessionClient ?? context?.clienteLens!,
                {
                  managedBy: item?.playerProfile,
                }
              );

              if (data?.isOk()) {
                profile = data?.value?.items?.[0]?.account;
              }

              return {
                ...player,
                profile,
              };
            }
          );

          const newPlayers = await Promise.all(newPlayerPromises);

          return {
            ...item,
            gate: {
              ...item?.gate,
              erc721Logic,
            },
            players: newPlayers,
            milestones: newMilestones,
            post,
          };
        });

        const questInfoResolved = await Promise.all(promises);

        setQuestInfo(questInfoResolved[0]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestInfoLoading(false);
  };

  useEffect(() => {
    if (questId && !questInfo && context?.clienteLens) {
      getQuestInfo();
    }
  }, [questId, context?.lensConectado?.profile, context?.clienteLens]);

  return {
    questInfo,
    questInfoLoading,
    setShowFullText,
    showFullText,
    mainViewer,
    setMainViewer,
    joinLoading,
    handlePlayerJoin,
    socialType,
    setSocialType,
    handleCompleteMilestone,
    completeLoading,
    getQuestInfo,
  };
};

export default useJoin;
