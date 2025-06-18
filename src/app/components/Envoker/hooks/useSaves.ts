import { ModalContext } from "@/app/providers";
import { Account, PageSize, Post } from "@lens-protocol/client";
import { fetchPostBookmarks } from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";

const useSaves = (profile: Account | undefined) => {
  const context = useContext(ModalContext);
  const [savesLoading, setSavesLoading] = useState<boolean>(false);
  const [allSaves, setAllSaves] = useState<Post[]>([]);
  const [savesInfo, setSavesInfo] = useState<{
    hasMore: boolean;
    cursor: string | undefined;
  }>({
    hasMore: true,
    cursor: undefined,
  });

  const getSaves = async () => {
    setSavesLoading(true);
    try {
      const data = await fetchPostBookmarks(
        context?.lensConectado?.sessionClient! ?? context?.clienteLens!,

        {
          pageSize: PageSize.Ten,
          filter: {
            metadata: {
              tags: {
                oneOf: ["kinora"],
              },
            },
          },
        }
      );

      if (data?.isOk()) {
        if (data?.value?.items?.length !== 10) {
          setSavesInfo({
            hasMore: false,
            cursor: undefined,
          });
        } else {
          setSavesInfo({
            hasMore: true,
            cursor: data?.value?.pageInfo?.next!,
          });
        }
        setAllSaves((data?.value?.items || []) as Post[]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setSavesLoading(false);
  };

  const getMoreSaves = async () => {
    if (!savesInfo.hasMore || !savesInfo.cursor) return;
    try {
      const data = await fetchPostBookmarks(
        context?.lensConectado?.sessionClient! ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          filter: {
            metadata: {
              tags: {
                oneOf: ["kinora"],
              },
            },
          },
          cursor: savesInfo?.cursor,
        }
      );

      if (data?.isOk()) {
        if (data?.value?.items?.length !== 10) {
          setSavesInfo({
            hasMore: false,
            cursor: undefined,
          });
        } else {
          setSavesInfo({
            hasMore: true,
            cursor: data?.value?.pageInfo?.next!,
          });
        }
        setAllSaves([...allSaves, data?.value?.items || []] as Post[]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      context?.clienteLens &&
      profile?.address == context?.lensConectado?.profile?.address
    ) {
      getSaves();
    }
  }, [profile, context?.clienteLens, context?.lensConectado]);

  return {
    getMoreSaves,
    savesLoading,
    savesInfo,
    allSaves,
  };
};

export default useSaves;
