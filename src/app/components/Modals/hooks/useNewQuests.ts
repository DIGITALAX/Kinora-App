import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import { useEffect, useState } from "react";
import { getQuests } from "../../../../../graphql/getQuests";
import { Quest } from "../../Common/types/common.types";

const useNewQuests = () => {
  const [newQuests, setNewQuests] = useState<Quest[]>([]);

  const getNewQuests = async () => {
    try {
      const data = await getQuests(4, 0);
      const promises = data?.data?.questInstantiateds?.map(
        async (item: any) => {
          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          return item;
        }
      );
      setNewQuests(await Promise.all(promises));
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
