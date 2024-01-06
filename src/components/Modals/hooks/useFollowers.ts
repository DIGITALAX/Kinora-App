import { useEffect, useState } from "react";
import { FollowBoxState } from "../../../../redux/reducers/followBoxSlice";
import { Profile } from "../../../../graphql/generated";
import following from "../../../../graphql/lens/queries/following";
import { LimitType } from "kinora-sdk/dist/@types/generated";
import followers from "../../../../graphql/lens/queries/followers";

const useFollowers = (
  followBox: FollowBoxState,
  lensConnected: Profile | undefined
) => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [followData, setFollowData] = useState<Profile[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | undefined>();

  const getFollowers = async () => {
    setDataLoading(true);
    try {
      const data = await followers(
        {
          of: followBox.id,
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );
      setFollowData((data?.data?.followers?.items || []) as Profile[]);
      setCursor(data?.data?.followers?.pageInfo?.next);
      if ((data?.data?.followers?.items || [])?.length == 10) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setDataLoading(false);
  };

  const getFollowing = async () => {
    setDataLoading(true);
    try {
      const data = await following(
        {
          for: followBox.id,
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );
      setFollowData((data?.data?.following?.items || []) as Profile[]);
      setCursor(data?.data?.following?.pageInfo?.next);
      if ((data?.data?.following?.items || [])?.length == 10) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setDataLoading(false);
  };

  const showMore = async () => {
    if (!hasMore) return;
    try {
      if (followBox?.type == "Followers") {
        const data = await followers(
          {
            of: followBox.id,
            limit: LimitType.Ten,
            cursor,
          },
          lensConnected?.id
        );
        setFollowData([
          ...followData,
          ...(data?.data?.followers?.items || []),
        ] as Profile[]);
        setCursor(data?.data?.followers?.pageInfo?.next);
        if ((data?.data?.followers?.items || [])?.length == 10) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } else {
        const data = await following(
          {
            for: followBox.id,
            limit: LimitType.Ten,
            cursor,
          },
          lensConnected?.id
        );
        setFollowData([
          ...followData,
          ...(data?.data?.following?.items || []),
        ] as Profile[]);
        setCursor(data?.data?.following?.pageInfo?.next);
        if ((data?.data?.following?.items || [])?.length == 10) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (followBox?.open) {
      if (followBox?.type == "Followers") {
        getFollowers();
      } else {
        getFollowing();
      }
    }
  }, [followBox?.open]);

  return {
    followData,
    hasMore,
    showMore,
    dataLoading,
  };
};

export default useFollowers;
