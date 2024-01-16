import { useEffect, useState } from "react";
import { Quest, SocialType } from "../types/quest.types";
import { getQuest } from "../../../../graphql/subgraph/getQuest";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import { Profile } from "../../../../graphql/generated";
import { getCollectionURI } from "../../../../graphql/subgraph/getAllCollections";
import { Dispatch } from "redux";
import { setQuestGates } from "../../../../redux/reducers/questGatesSlice";
import checkGates from "../../../../lib/helpers/checkGates";
import { PublicClient } from "viem";
import { Dispatch as KinoraDispatch } from "kinora-sdk";
import { ethers } from "ethers";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setSuccess } from "../../../../redux/reducers/successSlice";
import getProfile from "../../../../graphql/lens/queries/profile";
import fetchIPFSJSON from "../../../../lib/helpers/fetchIPFSJSON";

const useJoin = (
  questId: string,
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  kinoraDispatch: KinoraDispatch
) => {
  const [questInfoLoading, setQuestInfoLoading] = useState<boolean>(false);
  const [completeLoading, setCompleteLoading] = useState<boolean>(false);
  const [questInfo, setQuestInfo] = useState<Quest | undefined>();
  const [showFullText, setShowFullText] = useState<boolean>(false);
  const [mainViewer, setMainViewer] = useState<number>(0);
  const [joinLoading, setJoinLoading] = useState<boolean>(false);
  const [socialType, setSocialType] = useState<SocialType>(SocialType.Players);

  const handleCompleteMilestone = async (questCompleted: boolean) => {
    setCompleteLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        137
      );
      const signer = provider.getSigner();

      const { error, errorMessage } =
        await kinoraDispatch.playerCompleteQuestMilestone(
          questId as `0x${string}`,
          signer as any
        );

      if (error) {
        console.error(errorMessage);
        dispatch(setInteractError(true));
      } else {
        dispatch(
          setSuccess({
            open: true,
            image: questInfo?.milestones?.[
              mainViewer - 1
            ]?.milestoneMetadata?.cover?.includes("ipfs://")
              ? questInfo?.milestones?.[
                  mainViewer - 1
                ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
              : questInfo?.milestones?.[mainViewer - 1]?.milestoneMetadata
                  ?.cover,
            text: questCompleted
              ? "Quest Completed! You've leveled up. Ready for the next one?"
              : `Milestone ${mainViewer} Completed! See all your rewards in the dashboard.`,
          })
        );
        await getQuestInfo();
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCompleteLoading(false);
  };

  const handlePlayerJoin = async () => {
    if (!address) return;
    setJoinLoading(true);
    try {
      const data = await checkGates(questInfo?.gate!, publicClient, address);

      if (
        (data?.erc20 && data?.erc20?.length > 0) ||
        (data?.erc721 && data?.erc721?.length > 0)
      ) {
        setJoinLoading(false);
        dispatch(
          setQuestGates({
            erc20: data?.erc20,
            erc721: data?.erc721,
            oneOf: questInfo?.gate?.oneOf,
          })
        );
        return;
      }

      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        137
      );
      const signer = provider.getSigner();

      const { error, errorMessage } = await kinoraDispatch.playerJoinQuest(
        questId as `0x${string}`,
        signer as any
      );

      if (error) {
        console.error(errorMessage);
        dispatch(setInteractError(true));
      } else {
        dispatch(
          setSuccess({
            open: true,
            image: questInfo?.questMetadata?.cover?.includes("ipfs://")
              ? questInfo?.questMetadata?.cover?.split("ipfs://")?.[1]
              : questInfo?.questMetadata?.cover,
            text: "Quest accepted! Keep up with your stats in every video.",
          })
        );
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
      const data = await getQuest(
        parseInt(questId?.split("-")?.[1], 16)?.toString(),
        parseInt(questId?.split("-")?.[0], 16)?.toString()
      );

      if (data) {
        const questInstantiateds = data?.data?.questInstantiateds || [];
        const promises = questInstantiateds.map(async (item: any) => {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(item?.profileId)
              )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
            },
            lensConnected?.id
          );

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
                    pubId: string;
                    profileId: string;
                    minAVD: string;
                    minDuration: string;
                  },
                  i: number
                ) => {
                  const publication = await getPublication(
                    {
                      forId: `${toHexWithLeadingZero(
                        Number(video?.profileId)
                      )}-${toHexWithLeadingZero(Number(video?.pubId))}`,
                    },
                    lensConnected?.id
                  );

                  return {
                    ...video,
                    details: milestone?.milestoneMetadata?.videoCovers?.[i],
                    minAVD: Number(video?.minAVD) / 10 ** 18,
                    minDuration: Number(video?.minDuration) / 10 ** 18,
                    publication: publication?.data?.publication,
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
            async (player: { profileId: string }) => {
              const data = await getProfile(
                {
                  forProfileId: `${toHexWithLeadingZero(
                    Number(player?.profileId)
                  )}`,
                },
                lensConnected?.id
              );

              return {
                ...player,
                profile: data?.data?.profile,
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
            publication: publication?.data?.publication,
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
    if (questId && !questInfo) {
      getQuestInfo();
    }
  }, [questId, lensConnected]);

  return {
    questInfo,
    questInfoLoading,
    setQuestInfo,
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
