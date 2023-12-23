import { useEffect, useState } from "react";
import { Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";
import { setQuestFeed } from "../../../../redux/reducers/questFeedSlice";
import { getQuests } from "../../../../graphql/subgraph/getQuests";
import { Quest } from "@/components/Quest/types/quest.types";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import getPublication from "../../../../graphql/lens/queries/publication";

const useFeed = (
  dispatch: Dispatch,
  questFeed: Quest[],
  lensConnected: Profile | undefined
) => {
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [questInfo, setQuestInfo] = useState<{
    hasMore: boolean;
    cursor: number;
  }>({
    hasMore: true,
    cursor: 0,
  });

  const getQuestFeed = async () => {
    setFeedLoading(true);
    try {
      const data = await getQuests(25, 0);

      if (data?.data?.questCreateds?.length !== 25) {
        setQuestInfo({
          hasMore: false,
          cursor: 0,
        });
      } else {
        setQuestInfo({
          hasMore: true,
          cursor: 25,
        });
      }

      const promises = data?.data?.questCreateds?.map(async (item: any) => {
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
      });

      dispatch(setQuestFeed(((await Promise.all(promises)) || []) as Quest[]));
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreQuestFeed = async () => {
    if (!questInfo.hasMore || !questInfo.cursor) return;
    try {
      const data = await getQuests(25, questInfo?.cursor);

      if (data?.data?.questCreateds?.length !== 25) {
        setQuestInfo({
          hasMore: false,
          cursor: questInfo?.cursor,
        });
      } else {
        setQuestInfo({
          hasMore: true,
          cursor: questInfo?.cursor + 25,
        });
      }

      const promises = data?.data?.questCreateds?.map(async (item: any) => {
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
      });

      dispatch(
        setQuestFeed([
          ...questFeed,
          ...(((await Promise.all(promises)) || []) as Quest[]),
        ])
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (questFeed?.length < 1) {
      getQuestFeed();
    }
  }, []);

  return {
    feedLoading,
    getMoreQuestFeed,
    questInfo,
  };
};

export default useFeed;
