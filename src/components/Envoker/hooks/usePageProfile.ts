import { useEffect, useState } from "react";
import { Post, Profile } from "../../../../graphql/generated";
import getProfile from "../../../../graphql/lens/queries/profile";

const usePageProfile = (handle: string, lensConnected: Profile | undefined) => {
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [questsLoading, setQuestsLoading] = useState<boolean>(false);
  const [pageProfile, setPageProfile] = useState<Profile>();
  const [completedQuests, setCompletedQuests] = useState<Post[]>([]);
  const [liveQuests, setLiveQuests] = useState<Post[]>([]);
  const [envokedQuests, setEnvokedQuests] = useState<Post[]>([]);

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
