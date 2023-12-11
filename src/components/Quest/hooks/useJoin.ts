import { useEffect, useState } from "react";
import { Quest } from "../types/quest.types";

const useJoin = (questId: string) => {
  const [questInfoLoading, setQuestInfoLoading] = useState<boolean>(false);
  const [questInfo, setQuestInfo] = useState<Quest | undefined>();

  const getQuestInfo = async () => {
    setQuestInfoLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setQuestInfoLoading(false);
  };

  useEffect(() => {
    if (questId && !questInfo) {
      getQuestInfo();
    }
  }, [questId]);

  return {
    questInfo,
    questInfoLoading,
    setQuestInfo,
  };
};

export default useJoin;
