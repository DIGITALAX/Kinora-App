import { useEffect, useState } from "react";
import { Dispatch } from "redux";
import {
  LimitType,
  Post,
  Profile,
  PublicationType,
} from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import { KINORA_OPEN_ACTION } from "../../../../lib/constants";
import { setQuestFeed } from "../../../../redux/reducers/questFeedSlice";

const useFeed = (
  dispatch: Dispatch,
  questFeed: Post[],
  lensConnected: Profile | undefined
) => {
  const [feedLoading, setFeedLoading] = useState<boolean>(false);
  const [questInfo, setQuestInfo] = useState<{
    hasMore: boolean;
    cursor: string | undefined;
  }>({
    hasMore: true,
    cursor: undefined,
  });

  const getQuestFeed = async () => {
    setFeedLoading(true);
    try {
      const data = await getPublications(
        {
          where: {
            withOpenActions: [
              {
                address: KINORA_OPEN_ACTION,
              },
            ],
            publicationTypes: [PublicationType.Post],
          },
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      if (data?.data?.publications?.items?.length !== 10) {
        setQuestInfo({
          hasMore: false,
          cursor: data?.data?.publications?.pageInfo?.next,
        });
      } else {
        setQuestInfo({
          hasMore: true,
          cursor: data?.data?.publications?.pageInfo?.next,
        });
      }

      dispatch(setQuestFeed((data?.data?.publications?.items || []) as Post[]));
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreQuestFeed = async () => {
    if (!questInfo.hasMore || !questInfo.cursor) return;
    try {
      const data = await getPublications(
        {
          where: {
            withOpenActions: [
              {
                address: KINORA_OPEN_ACTION,
              },
            ],
            publicationTypes: [PublicationType.Post],
          },
          limit: LimitType.Ten,
          cursor: questInfo.cursor,
        },
        lensConnected?.id
      );

      if (data?.data?.publications?.items?.length !== 10) {
        setQuestInfo({
          hasMore: false,
          cursor: data?.data?.publications?.pageInfo?.next,
        });
      } else {
        setQuestInfo({
          hasMore: true,
          cursor: data?.data?.publications?.pageInfo?.next,
        });
      }

      dispatch(
        setQuestFeed([
          ...questFeed,
          ...((data?.data?.publications?.items || []) as Post[]),
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
