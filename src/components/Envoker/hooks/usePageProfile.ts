import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import getProfile from "../../../../graphql/lens/queries/profile";
import { Quest } from "@/components/Quest/types/quest.types";
import { getQuestsEnvoker } from "../../../../graphql/subgraph/getQuests";
import { getPlayerData } from "../../../../graphql/subgraph/getPlayer";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import { getQuestById } from "../../../../graphql/subgraph/getQuest";

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
          forHandle: "test/" + handle,
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

          return {
            ...item,
            type: "envoked",
            players,
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
              const data = await getQuestById(item);
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

              const quest = {
                ...data?.data?.questInstantiateds?.[0],
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
        [...completedQuests, ...liveQuests, ...envoked].sort(
          () => 0.5 - Math.random()
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
          async (item: any) => {
            const publication = await getPublication(
              {
                forId: `${toHexWithLeadingZero(
                  Number(item?.profileId)
                )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
              },
              lensConnected?.id
            );

            return {
              ...item,
              publication: publication?.data?.publication,
              type: "envoked",
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
        if (!item) return;
        playerPromises.push(
          (async () => {
            const data = await getQuestById(item);
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

            const quest = {
              ...data?.data?.questInstantiateds?.[0],
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
        [...newCompletedQuests, ...newLiveQuests, ...envoked].sort(
          () => 0.5 - Math.random()
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
