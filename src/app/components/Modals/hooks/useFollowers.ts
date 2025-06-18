import { useContext, useEffect, useState } from "react";
import { ModalContext } from "@/app/providers";
import { fetchFollowers, fetchFollowing } from "@lens-protocol/client/actions";
import { Account, PageSize } from "@lens-protocol/client";

const useFollowers = () => {
  const context = useContext(ModalContext);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [followData, setFollowData] = useState<Account[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [cursor, setCursor] = useState<string | undefined>();

  const getFollowers = async () => {
    setDataLoading(true);
    try {
      const data = await fetchFollowers(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          account: context?.followBox?.id,
          pageSize: PageSize.Fifty,
        }
      );
      if (data?.isOk()) {
        setFollowData(
          (data?.value?.items?.map((ac) => ac?.follower) || []) as Account[]
        );
        setCursor(data?.value?.pageInfo?.next!);
        if ((data?.value?.items || [])?.length == 50) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setDataLoading(false);
  };

  const getFollowing = async () => {
    setDataLoading(true);
    try {
      const data = await fetchFollowing(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          account: context?.followBox?.id,
          pageSize: PageSize.Fifty,
        }
      );
      if (data?.isOk()) {
        setFollowData(
          (data?.value?.items?.map((ac) => ac?.following) || []) as Account[]
        );
        setCursor(data?.value?.pageInfo?.next!);
        if ((data?.value?.items || [])?.length == 50) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setDataLoading(false);
  };

  const showMore = async () => {
    if (!hasMore) return;
    try {
      if (context?.followBox?.type == "Followers") {
        const data = await fetchFollowers(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            account: context?.followBox?.id,
            pageSize: PageSize.Fifty,
          }
        );
        if (data?.isOk()) {
          setFollowData((prev) => [
            ...prev,
            ...((data?.value?.items?.map((ac) => ac?.follower) ||
              []) as Account[]),
          ]);
          setCursor(data?.value?.pageInfo?.next!);
          if ((data?.value?.items || [])?.length == 50) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }
        }
      } else {
        const data = await fetchFollowing(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            account: context?.followBox?.id,
            pageSize: PageSize.Fifty,
          }
        );
        if (data?.isOk()) {
          setFollowData((prev) => [
            ...prev,
            ...((data?.value?.items?.map((ac) => ac?.following) ||
              []) as Account[]),
          ]);
          setCursor(data?.value?.pageInfo?.next!);
          if ((data?.value?.items || [])?.length == 50) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (context?.followBox) {
      if (context?.followBox?.type == "Followers") {
        getFollowers();
      } else {
        getFollowing();
      }
    }
  }, [context?.followBox]);

  return {
    followData,
    hasMore,
    showMore,
    dataLoading,
  };
};

export default useFollowers;
