import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import getProfile from "../../../../graphql/lens/queries/profile";
import { Quest } from "@/components/Quest/types/quest.types";

const usePageProfile = (handle: string, lensConnected: Profile | undefined) => {
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [pageProfile, setPageProfile] = useState<Profile>();
  const [completedQuests, setCompletedQuests] = useState<Quest[]>([]);
  const [liveQuests, setLiveQuests] = useState<Quest[]>([]);
  const [envokedQuests, setEnvokedQuests] = useState<Quest[]>([]);

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
      await getProfileQuests();
    } catch (err: any) {
      console.error(err.message);
    }
    setProfileLoading(false);
  };

  const getProfileQuests = async () => {
    setQuestsLoading(true);
    try {
      // get completed
      // get live
      // get envoked
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestsLoading(false);
  };

  useEffect(() => {
    if (handle) {
      getPageProfile();
    }
  }, [handle]);

  return {
    profileLoading,
    pageProfile,
    questsLoading,
    setCompletedQuests,
    setLiveQuests,
    completedQuests,
    liveQuests,
    envokedQuests,
    setEnvokedQuests,
  };
};

export default usePageProfile;
