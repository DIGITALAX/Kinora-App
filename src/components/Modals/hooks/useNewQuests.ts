import { Quest } from "@/components/Quest/types/quest.types";
import { useEffect, useState } from "react";
import { getQuests } from "../../../../graphql/subgraph/getQuests";

const useNewQuests = () => {
  const [newQuests, setNewQuests] = useState<Quest[]>([]);

  const getNewQuests = async () => {
    try {
      const data = await getQuests(4, 0);
      setNewQuests(data?.data?.questInstantiateds);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (newQuests?.length < 1) {
      getNewQuests();
    }
  }, []);

  return {
    newQuests,
  };
};

export default useNewQuests;
