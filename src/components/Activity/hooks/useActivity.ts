import { useEffect, useState } from "react";
import { Profile } from "../../../../graphql/generated";
import { Quest } from "@/components/Quest/types/quest.types";

const useActivity = (lensConnected: Profile | undefined) => {
  const [activityLoading, setActivityLoading] = useState<boolean>(false);
  const [activityFeed, setActivityFeed] = useState<Quest[]>([]);
  const [activityInfo, setActivityInfo] = useState<{
    hasMore: boolean;
    cursor: number;
  }>({
    hasMore: true,
    cursor: 0,
  });

  const getActivityFeed = async () => {
    try {
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const getMoreActivityFeed = async () => {
    try {
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    if (activityFeed?.length < 1) {
        getActivityFeed()
    }
  }, [lensConnected])

  return {
    activityLoading,
    setActivityFeed,
    getMoreActivityFeed,
    activityInfo,
    activityFeed,
  };
};

export default useActivity;
