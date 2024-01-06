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
  const [allPlayerData, setAllPlayerData] = useState<{
    questsCompleted: string[];
    questsJoined: string[];
  }>({
    questsCompleted: [],
    questsJoined: [],
  });
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [liveQuests, setLiveQuests] = useState<Quest[]>([]);
  const [envokedQuests, setEnvokedQuests] = useState<Quest[]>([]);
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

          return {
            ...item,
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
                completedQuests.push(quest);
              } else {
                liveQuests.push(quest);
              }
            })()
          );
        }
      }

      const envoked = await Promise.all(envokedPromises);
      await Promise.all(playerPromises);

      setCompletedQuests(completedQuests || []);
      setLiveQuests(liveQuests || []);
      setEnvokedQuests(envoked || []);

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

  const getMoreEnvoked = async (): Promise<void> => {
    if (!info.hasMoreEnvoked) return;
    try {
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
          };
        }
      );

      const envoked = await Promise.all(envokedPromises);

      setEnvokedQuests([...envokedQuests, ...envoked]);

      setInfo({
        ...info,
        hasMoreEnvoked: envoked?.length == 25 ? true : false,
        envokedCursor: info.envokedCursor + 25,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getMorePlayer = async (): Promise<void> => {
    if (!info.hasMorePlayer) return;
    try {
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
              completedQuests.push(quest);
            } else {
              liveQuests.push(quest);
            }
          })()
        );
      }

      await Promise.all(playerPromises);

      setCompletedQuests([...completedQuests, ...newCompletedQuests]);
      setLiveQuests([...liveQuests, ...newLiveQuests]);

      setInfo({
        ...info,
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
    completedQuests,
    liveQuests,
    envokedQuests,
    info,
    getMorePlayer,
    getMoreEnvoked,
    setCompletedQuests,
    setLiveQuests,
    setEnvokedQuests,
  };
};

export default usePageProfile;
