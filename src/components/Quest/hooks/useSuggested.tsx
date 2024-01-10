import { useEffect, useState } from "react";
import { Quest } from "../types/quest.types";
import { getQuests } from "../../../../graphql/subgraph/getQuests";
import getPublication from "../../../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import { Profile } from "../../../../graphql/generated";
import fetchIPFSJSON from "../../../../lib/helpers/fetchIPFSJSON";

const useSuggested = (lensConnected: Profile | undefined) => {
  const [suggestedInfo, setSuggestedInfo] = useState<{
    cursor: number;
    hasMore: boolean;
  }>({
    cursor: 0,
    hasMore: true,
  });
  const [suggestedLoading, setSuggestedLoading] = useState<boolean>(false);
  const [suggestedQuests, setSuggestedQuests] = useState<Quest[]>([]);

  const getSuggested = async () => {
    setSuggestedLoading(true);
    try {
      const data = await getQuests(25, 0);

      if (data?.data?.questInstantiateds?.length !== 25) {
        setSuggestedInfo({
          hasMore: false,
          cursor: 0,
        });
      } else {
        setSuggestedInfo({
          hasMore: true,
          cursor: 25,
        });
      }

      const promises = (data?.data?.questInstantiateds || [])?.map(
        async (item: any) => {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(item?.profileId)
              )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
            },
            lensConnected?.id
          );

          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          return {
            ...item,
            publication: publication?.data?.publication,
          };
        }
      );

      setSuggestedQuests(((await Promise.all(promises)) || []) as Quest[]);
    } catch (err: any) {
      console.error(err.message);
    }
    setSuggestedLoading(false);
  };

  const getMoreSuggested = async () => {
    if (!suggestedInfo.hasMore || !suggestedInfo.cursor) return;
    try {
      const data = await getQuests(25, suggestedInfo?.cursor);

      if (data?.data?.questInstantiateds?.length !== 25) {
        setSuggestedInfo({
          hasMore: false,
          cursor: suggestedInfo?.cursor,
        });
      } else {
        setSuggestedInfo({
          hasMore: true,
          cursor: suggestedInfo?.cursor + 25,
        });
      }

      const promises = data?.data?.questInstantiateds?.map(
        async (item: any) => {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(item?.profileId)
              )}-${toHexWithLeadingZero(Number(item?.pubId))}`,
            },
            lensConnected?.id
          );

          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          return {
            ...item,
            publication: publication?.data?.publication,
          };
        }
      );

      setSuggestedQuests([
        ...suggestedQuests,
        ...(((await Promise.all(promises)) || []) as Quest[]),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    getSuggested();
  }, []);

  return {
    suggestedLoading,
    getMoreSuggested,
    suggestedInfo,
    suggestedQuests,
    setSuggestedQuests,
  };
};

export default useSuggested;
