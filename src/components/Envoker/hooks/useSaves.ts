import { useEffect, useState } from "react";
import bookmarks from "../../../../graphql/lens/queries/bookmarks";
import { LimitType, Post, Profile } from "../../../../graphql/generated";
import { AccountType } from "../types/envoker.types";

const useSaves = (
  lensConnected: Profile | undefined,
  handle: string,
  accountType: AccountType
) => {
  const [savesLoading, setSavesLoading] = useState<boolean>(false);
  const [allSaves, setAllSaves] = useState<Post[]>([]);
  const [savesInfo, setSavesInfo] = useState<{
    hasMore: boolean;
    cursor: string | undefined;
  }>({
    hasMore: false,
    cursor: undefined,
  });

  const getSaves = async () => {
    setSavesLoading(true);
    try {
      const data = await bookmarks({
        where: {
          metadata: {
            publishedOn: ["kinora"],
          },
        },
        limit: LimitType.Ten,
      });

      if (data?.data?.publicationBookmarks?.items?.length !== 10) {
        setSavesInfo({
          hasMore: false,
          cursor: undefined,
        });
      } else {
        setSavesInfo({
          hasMore: true,
          cursor: data?.data?.publicationBookmarks?.pageInfo?.next,
        });
      }
      setAllSaves((data?.data?.publicationBookmarks?.items || []) as Post[]);
    } catch (err: any) {
      console.error(err.message);
    }
    setSavesLoading(false);
  };

  const getMoreSaves = async () => {
    if (!savesInfo.hasMore || !savesInfo.cursor) return;
    try {
      const data = await bookmarks({
        where: {
          metadata: {
            publishedOn: ["kinora"],
          },
        },
        limit: LimitType.Ten,
      });

      if (data?.data?.publicationBookmarks?.items?.length !== 10) {
        setSavesInfo({
          hasMore: false,
          cursor: undefined,
        });
      } else {
        setSavesInfo({
          hasMore: true,
          cursor: data?.data?.publicationBookmarks?.pageInfo?.next,
        });
      }
      setAllSaves([
        ...allSaves,
        data?.data?.publicationBookmarks?.items || [],
      ] as Post[]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      lensConnected?.id &&
      accountType == AccountType.Save &&
      handle ==
        lensConnected?.handle?.suggestedFormatted?.localName?.split("@")?.[1]
    ) {
      getSaves();
    }
  }, [accountType, handle, lensConnected]);

  return {
    getMoreSaves,
    savesLoading,
    savesInfo,
    allSaves,
    setAllSaves,
  };
};

export default useSaves;
