import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import getProfile from "../../../../graphql/lens/queries/profile";
import { Milestone, Player, Quest } from "@/components/Quest/types/quest.types";
import { getQuestsEnvoker } from "../../../../graphql/subgraph/getQuests";
import { getPlayerData } from "../../../../graphql/subgraph/getPlayer";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import { getQuestById } from "../../../../graphql/subgraph/getQuest";
import fetchIPFSJSON from "../../../../lib/helpers/fetchIPFSJSON";

const usePageProfile = (handle: string, lensConnected: Profile | undefined) => {
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [pageProfile, setPageProfile] = useState<Profile>();
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
      const data = await getProfile(
        {
          forHandle: "lens/" + handle,
        },
        lensConnected?.id
      );
      setPageProfile(data?.data?.profile as Profile);
      await getProfileQuests(data?.data?.profile as Profile);
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const getProfileQuests = async (pageProfile: Profile) => {
    setQuestsLoading(true);
    try {
      const envokedData = await getQuestsEnvoker(
        25,
        0,
        parseInt(pageProfile?.id, 16)
      );

      const envokedPromises = envokedData?.data?.questInstantiateds?.map(
        async (item: Quest) => {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(item?.profileId)
              )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
            },
            lensConnected?.id
          );

          if (!item?.questMetadata) {
            const uri = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: uri,
            };
          }

          const playerPromises = item?.players?.map(async (player) => {
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
          });

          const players = await Promise.all(playerPromises);

          const newMilestonesPromises = item?.milestones.map(
            async (milestone: any) => {
              const videoPromises = milestone?.videos?.map(
                async (video: {
                  pubId: string;
                  profileId: string;
                  minAVD: string;
                  minDuration: string;
                }) => {
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
                    minAVD: Number(video?.minAVD) / 10 ** 18,
                    minDuration: Number(video?.minDuration) / 10 ** 18,
                    publication: publication?.data?.publication,
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
                publication: (
                  milestones?.find((milestone: Milestone) =>
                    milestone?.videos?.find(
                      (vid) =>
                        Number(vid?.pubId) == Number(video?.pubId) &&
                        Number(vid?.profileId) == Number(video?.profileId)
                    )
                  ) as Milestone
                )?.videos?.find(
                  (vid) =>
                    Number(vid?.pubId) == Number(video?.pubId) &&
                    Number(vid?.profileId) == Number(video?.profileId)
                )?.publication,
              })),
            })),
            publication: publication?.data?.publication,
          };
        }
      );

      const playerQuest = await getPlayerData(parseInt(pageProfile?.id, 16));
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
              const publication = await getPublication(
                {
                  forId: `${toHexWithLeadingZero(
                    Number(data?.data?.questInstantiateds?.[0]?.profileId)
                  )}-${toHexWithLeadingZero(
                    Number(data?.data?.questInstantiateds?.[0]?.pubId)
                  )}`,
                },
                lensConnected?.id
              );

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
                        pubId: string;
                        profileId: string;
                        minAVD: string;
                        minDuration: string;
                      }) => {
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
                          minAVD: Number(video?.minAVD) / 10 ** 18,
                          minDuration: Number(video?.minDuration) / 10 ** 18,
                          publication: publication?.data?.publication,
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
                      publication: (
                        milestones?.find((milestone: Milestone) =>
                          milestone?.videos?.find(
                            (vid) =>
                              Number(vid?.pubId) == Number(video?.pubId) &&
                              Number(vid?.profileId) == Number(video?.profileId)
                          )
                        ) as Milestone
                      )?.videos?.find(
                        (vid) =>
                          Number(vid?.pubId) == Number(video?.pubId) &&
                          Number(vid?.profileId) == Number(video?.profileId)
                      )?.publication,
                    })),
                  })
                ),
                publication: publication?.data?.publication,
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
          parseInt(pageProfile?.id, 16)
        );

        const envokedPromises = envokedData?.data?.questInstantiateds?.map(
          async (item: Quest) => {
            const publication = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(item?.profileId)
                )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
              },
              lensConnected?.id
            );

            if (!item?.questMetadata) {
              const uri = await fetchIPFSJSON(item?.uri);
              item = {
                ...item,
                questMetadata: uri,
              };
            }

            const playerPromises = item?.players?.map(async (player) => {
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
            });

            const players = await Promise.all(playerPromises);

            const newMilestonesPromises = item?.milestones.map(
              async (milestone: any) => {
                const videoPromises = milestone?.videos?.map(
                  async (video: {
                    pubId: string;
                    profileId: string;
                    minAVD: string;
                    minDuration: string;
                  }) => {
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
                      minAVD: Number(video?.minAVD) / 10 ** 18,
                      minDuration: Number(video?.minDuration) / 10 ** 18,
                      publication: publication?.data?.publication,
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
                  publication: (
                    milestones?.find((milestone: Milestone) =>
                      milestone?.videos?.find(
                        (vid) =>
                          Number(vid?.pubId) == Number(video?.pubId) &&
                          Number(vid?.profileId) == Number(video?.profileId)
                      )
                    ) as Milestone
                  )?.videos?.find(
                    (vid) =>
                      Number(vid?.pubId) == Number(video?.pubId) &&
                      Number(vid?.profileId) == Number(video?.profileId)
                  )?.publication,
                })),
              })),
              publication: publication?.data?.publication,
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
            const publication = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(data?.data?.questInstantiateds?.[0]?.profileId)
                )}-${toHexWithLeadingZero(
                  Number(data?.data?.questInstantiateds?.[0]?.pubId)
                )}`,
              },
              lensConnected?.id
            );

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
                      pubId: string;
                      profileId: string;
                      minAVD: string;
                      minDuration: string;
                    }) => {
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
                        minAVD: Number(video?.minAVD) / 10 ** 18,
                        minDuration: Number(video?.minDuration) / 10 ** 18,
                        publication: publication?.data?.publication,
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
                    publication: (
                      milestones?.find((milestone: Milestone) =>
                        milestone?.videos?.find(
                          (vid) =>
                            Number(vid?.pubId) == Number(video?.pubId) &&
                            Number(vid?.profileId) == Number(video?.profileId)
                        )
                      ) as Milestone
                    )?.videos?.find(
                      (vid) =>
                        Number(vid?.pubId) == Number(video?.pubId) &&
                        Number(vid?.profileId) == Number(video?.profileId)
                    )?.publication,
                  })),
                })
              ),
              publication: publication?.data?.publication,
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
    if (handle) {
      getPageProfile();
    }
  }, [handle, lensConnected]);

  return {
    profileLoading,
    pageProfile,
    questsLoading,
    quests,
    info,
    getMore,
    setQuests,
  };
};

export default usePageProfile;
