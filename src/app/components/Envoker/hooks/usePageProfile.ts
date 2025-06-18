import { ModalContext } from "@/app/providers";
import { Account } from "@lens-protocol/client";
import { useContext, useEffect, useState } from "react";
import { Milestone, Player, Quest } from "../../Common/types/common.types";
import { fetchAccount, fetchPost } from "@lens-protocol/client/actions";
import { getQuestsEnvoker } from "../../../../../graphql/getQuests";
import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import { getPlayerData } from "../../../../../graphql/getPlayer";
import { getQuestById } from "../../../../../graphql/getQuest";

const usePageProfile = (handle: string) => {
  const context = useContext(ModalContext);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [pageProfile, setPageProfile] = useState<Account>();
  const [quests, setQuests] = useState<(Quest & { type: string })[]>([]);
  const [allPlayerData, setAllPlayerData] = useState<{
    questsCompleted: string[];
    questsJoined: string[];
  }>({
    questsCompleted: [],
    questsJoined: [],
  });
  const [info, setInfo] = useState<{
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  }>({
    hasMorePlayer: false,
    hasMoreEnvoked: false,
    playerCursor: 0,
    envokedCursor: 0,
  });

  const getPageProfile = async () => {
    setProfileLoading(true);
    try {
      const data = await fetchAccount(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          username: {
            localName: handle,
          },
        }
      );
      if (data?.isOk()) {
        setPageProfile(data?.value as Account);
        await getProfileQuests(data?.value as Account);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const getProfileQuests = async (pageProfile: Account) => {
    setQuestsLoading(true);
    try {
      const envokedData = await getQuestsEnvoker(25, 0, pageProfile?.owner);
      const envokedPromises = envokedData?.data?.questInstantiateds?.map(
        async (item: Quest) => {
          let post;
          const data = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (data?.isOk()) {
            post = data?.value;
          }

          if (!item?.questMetadata) {
            const uri = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: uri,
            };
          }

          const playerPromises = item?.players?.map(async (player) => {
            let profile;
            const data = await fetchAccount(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                address: player?.profile?.address,
              }
            );

            if (data?.isOk()) {
              profile = data?.value;
            }

            return {
              ...player,
              profile,
            };
          });

          const players = await Promise.all(playerPromises);

          const newMilestonesPromises = item?.milestones.map(
            async (milestone: any) => {
              const videoPromises = milestone?.videos?.map(
                async (video: {
                  postId: string;
                  minAVD: string;
                  minDuration: string;
                }) => {
                  let post;
                  const res = await fetchPost(
                    context?.lensConectado?.sessionClient ??
                      context?.clienteLens!,
                    {
                      post: video?.postId,
                    }
                  );

                  if (res?.isOk()) {
                    post = res?.value;
                  }
                  return {
                    ...video,
                    minAVD: Number(video?.minAVD) / 10 ** 18,
                    minDuration: Number(video?.minDuration) / 10 ** 18,
                    post,
                  };
                }
              );

              const videos = await Promise.all(videoPromises);
              return {
                ...milestone,
                videos,
              };
            }
          );

          const milestones = await Promise.all(newMilestonesPromises);

          return {
            ...item,
            milestones,
            type: "envoked",
            players: players?.map((player) => ({
              ...player,
              videos: player?.videos?.map((video) => ({
                ...video,
                avd: Number(video?.avd || 0) / 10 ** 18,
                duration: Number(video?.duration || 0) / 10 ** 18,
                post: (
                  milestones?.find((milestone: Milestone) =>
                    milestone?.videos?.find(
                      (vid) => Number(vid?.postId) == Number(video?.postId)
                    )
                  ) as Milestone
                )?.videos?.find(
                  (vid) => Number(vid?.postId) == Number(video?.postId)
                )?.post,
              })),
            })),
            post,
          };
        }
      );

      const playerQuest = await getPlayerData(pageProfile?.address);
      setAllPlayerData(playerQuest?.data?.players?.[0]);

      let liveQuests: Quest[] = [];
      let completedQuests: Quest[] = [];

      const playerPromises = [];
      if (playerQuest?.data?.players?.[0]?.questsJoined) {
        for (
          let i = 0;
          i <
          (playerQuest.data.players[0].questsJoined?.length < 25
            ? playerQuest.data.players[0].questsJoined?.length
            : 25);
          i++
        ) {
          const item = playerQuest.data.players[0].questsJoined?.[i];
          playerPromises.push(
            (async () => {
              let data = await getQuestById(item);
              let post;
              const res = await fetchPost(
                context?.lensConectado?.sessionClient ?? context?.clienteLens!,
                {
                  post: data?.data?.questInstantiateds?.[0]?.postId,
                }
              );

              if (res?.isOk()) {
                post = res?.value;
              }

              if (
                data?.data &&
                !data?.data?.questInstantiateds?.[0]?.questMetadata
              ) {
                const uri = await fetchIPFSJSON(
                  data?.data?.questInstantiateds?.[0]?.uri
                );
                data.data.questInstantiateds[0] = {
                  ...data.data.questInstantiateds[0],
                  questMetadata: uri,
                };
              }

              const newMilestonesPromises =
                data?.data?.questInstantiateds?.[0]?.milestones.map(
                  async (milestone: any) => {
                    const videoPromises = milestone?.videos?.map(
                      async (video: {
                        postId: string;
                        minAVD: string;
                        minDuration: string;
                      }) => {
                        const post = await fetchPost(
                          context?.lensConectado?.sessionClient ??
                            context?.clienteLens!,
                          {
                            post: video?.postId,
                          }
                        );
                        return {
                          ...video,
                          minAVD: Number(video?.minAVD) / 10 ** 18,
                          minDuration: Number(video?.minDuration) / 10 ** 18,
                          post,
                        };
                      }
                    );

                    const videos = await Promise.all(videoPromises);
                    return {
                      ...milestone,
                      videos,
                    };
                  }
                );

              const milestones = await Promise.all(newMilestonesPromises);

              const quest = {
                ...data?.data?.questInstantiateds?.[0],
                milestones,
                players: data?.data?.questInstantiateds?.[0]?.players?.map(
                  (player: Player) => ({
                    ...player,
                    videos: player?.videos?.map((video) => ({
                      ...video,
                      avd: Number(video?.avd || 0) / 10 ** 18,
                      duration: Number(video?.duration || 0) / 10 ** 18,
                      post: (
                        milestones?.find((milestone: Milestone) =>
                          milestone?.videos?.find(
                            (vid) =>
                              Number(vid?.postId) == Number(video?.postId)
                          )
                        ) as Milestone
                      )?.videos?.find(
                        (vid) => Number(vid?.postId) == Number(video?.postId)
                      )?.post,
                    })),
                  })
                ),
                post,
              };
              if (
                playerQuest?.data?.players?.[0]?.questsCompleted?.includes(item)
              ) {
                completedQuests.push({
                  ...quest,
                  type: "completed",
                });
              } else {
                liveQuests.push({
                  ...quest,
                  type: "live",
                });
              }
            })()
          );
        }
      }
      const envoked = await Promise.all(envokedPromises);
      await Promise.all(playerPromises);

      setQuests(
        [...completedQuests, ...liveQuests, ...envoked]?.sort(
          (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
        )
      );
      setInfo({
        hasMorePlayer:
          completedQuests?.length + liveQuests?.length == 25 ? true : false,
        hasMoreEnvoked: envoked?.length == 25 ? true : false,
        playerCursor: 25,
        envokedCursor: 25,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestsLoading(false);
  };

  const getMore = async (): Promise<void> => {
    if (!info.hasMorePlayer && !info.hasMoreEnvoked) return;
    try {
      let envoked = [];
      if (info.hasMoreEnvoked) {
        const envokedData = await getQuestsEnvoker(
          25,
          info.envokedCursor,
          pageProfile?.owner
        );

        const envokedPromises = envokedData?.data?.questInstantiateds?.map(
          async (item: Quest) => {
            let post;
            const res = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: item?.postId,
              }
            );

            if (res?.isOk()) {
              post = res?.value;
            }

            if (!item?.questMetadata) {
              const uri = await fetchIPFSJSON(item?.uri);
              item = {
                ...item,
                questMetadata: uri,
              };
            }

            const playerPromises = item?.players?.map(async (player) => {
              let profile;
              const data = await fetchAccount(
                context?.lensConectado?.sessionClient ?? context?.clienteLens!,
                {
                  address: player?.profile?.address,
                }
              );

              if (data?.isOk()) {
                profile = data?.value;
              }

              return {
                ...player,
                profile,
              };
            });

            const players = await Promise.all(playerPromises);

            const newMilestonesPromises = item?.milestones.map(
              async (milestone: any) => {
                const videoPromises = milestone?.videos?.map(
                  async (video: {
                    postId: string;
                    minAVD: string;
                    minDuration: string;
                  }) => {
                    let post;
                    const res = await fetchPost(
                      context?.lensConectado?.sessionClient ??
                        context?.clienteLens!,
                      {
                        post: video?.postId,
                      }
                    );

                    if (res?.isOk()) {
                      post = res?.value;
                    }

                    return {
                      ...video,
                      minAVD: Number(video?.minAVD) / 10 ** 18,
                      minDuration: Number(video?.minDuration) / 10 ** 18,
                      post,
                    };
                  }
                );

                const videos = await Promise.all(videoPromises);
                return {
                  ...milestone,
                  videos,
                };
              }
            );

            const milestones = await Promise.all(newMilestonesPromises);

            return {
              ...item,
              milestones,
              type: "envoked",
              players: players?.map((player) => ({
                ...player,
                videos: player?.videos?.map((video) => ({
                  ...video,
                  avd: Number(video?.avd || 0) / 10 ** 18,
                  duration: Number(video?.duration || 0) / 10 ** 18,
                  post: (
                    milestones?.find((milestone: Milestone) =>
                      milestone?.videos?.find(
                        (vid) => Number(vid?.postId) == Number(video?.postId)
                      )
                    ) as Milestone
                  )?.videos?.find(
                    (vid) => Number(vid?.postId) == Number(video?.postId)
                  )?.post,
                })),
              })),
              post,
            };
          }
        );

        envoked = await Promise.all(envokedPromises);
      }

      let newLiveQuests: Quest[] = [];
      let newCompletedQuests: Quest[] = [];

      const playerPromises = [];

      for (
        let i = 0;
        i <
        (allPlayerData?.questsJoined?.slice(0, info?.playerCursor)?.length < 25
          ? allPlayerData?.questsJoined?.slice(0, info?.playerCursor)?.length
          : 25);
        i++
      ) {
        const item = allPlayerData?.questsJoined?.[i + info?.playerCursor];
        playerPromises.push(
          (async () => {
            let data = await getQuestById(item);
            let post;
            const res = await fetchPost(
              context?.lensConectado?.sessionClient ?? context?.clienteLens!,
              {
                post: data?.data?.questInstantiateds?.[0]?.postId,
              }
            );

            if (res?.isOk()) {
              post = res?.value;
            }

            if (
              data?.data &&
              !data?.data?.questInstantiateds?.[0]?.questMetadata
            ) {
              const uri = await fetchIPFSJSON(
                data?.data?.questInstantiateds?.[0]?.uri
              );
              data.data.questInstantiateds[0] = {
                ...data.data.questInstantiateds[0],
                questMetadata: uri,
              };
            }

            const newMilestonesPromises =
              data?.data?.questInstantiateds?.[0]?.milestones.map(
                async (milestone: any) => {
                  const videoPromises = milestone?.videos?.map(
                    async (video: {
                      postId: string;
                      minAVD: string;
                      minDuration: string;
                    }) => {
                      let post;
                      const res = await fetchPost(
                        context?.lensConectado?.sessionClient ??
                          context?.clienteLens!,
                        {
                          post: video?.postId,
                        }
                      );

                      if (res?.isOk()) {
                        post = res?.value;
                      }

                      return {
                        ...video,
                        minAVD: Number(video?.minAVD) / 10 ** 18,
                        minDuration: Number(video?.minDuration) / 10 ** 18,
                        post,
                      };
                    }
                  );

                  const videos = await Promise.all(videoPromises);
                  return {
                    ...milestone,
                    videos,
                  };
                }
              );

            const milestones = await Promise.all(newMilestonesPromises);

            const quest = {
              ...data?.data?.questInstantiateds?.[0],
              milestones,
              players: data?.data?.questInstantiateds?.[0]?.players?.map(
                (player: Player) => ({
                  ...player,
                  videos: player?.videos?.map((video) => ({
                    ...video,
                    avd: Number(video?.avd || 0) / 10 ** 18,
                    duration: Number(video?.duration || 0) / 10 ** 18,
                    post: (
                      milestones?.find((milestone: Milestone) =>
                        milestone?.videos?.find(
                          (vid) => Number(vid?.postId) == Number(video?.postId)
                        )
                      ) as Milestone
                    )?.videos?.find(
                      (vid) => Number(vid?.postId) == Number(video?.postId)
                    )?.post,
                  })),
                })
              ),
              post,
            };
            if (allPlayerData?.questsCompleted?.includes(item)) {
              newCompletedQuests.push({
                ...quest,
                type: "completed",
              });
            } else {
              newLiveQuests.push({
                ...quest,
                type: "live",
              });
            }
          })()
        );
      }

      await Promise.all(playerPromises);

      setQuests(
        [...newCompletedQuests, ...newLiveQuests, ...envoked]?.sort(
          (a, b) => Number(b.blockTimestamp) - Number(a.blockTimestamp)
        )
      );

      setInfo({
        hasMoreEnvoked: envoked?.length == 25 ? true : false,
        envokedCursor: info.envokedCursor + 25,
        hasMorePlayer:
          newCompletedQuests?.length + newLiveQuests?.length == 25
            ? true
            : false,
        playerCursor: info.playerCursor + 25,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (handle && context?.clienteLens) {
      getPageProfile();
    }
  }, [handle, context?.lensConectado, context?.clienteLens]);

  return {
    profileLoading,
    pageProfile,
    questsLoading,
    quests,
    info,
    getMore,
  };
};

export default usePageProfile;
