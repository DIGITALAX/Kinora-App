import { ModalContext } from "@/app/providers";
import { useContext, useEffect, useState } from "react";
import { getQuests } from "../../../../../graphql/getQuests";
import { fetchPost } from "@lens-protocol/client/actions";
import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import { Post } from "@lens-protocol/client";
import { Quest } from "../types/common.types";

const useFeed = () => {
  const context = useContext(ModalContext);
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
      if (data?.data?.questInstantiateds?.length !== 25) {
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

      const promises = (data?.data?.questInstantiateds || [])?.map(
        async (item: any) => {
          let post;
          const res = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          if (res?.isOk()) {
            post = res?.value as Post;
          }

          return {
            ...item,
            post,
          };
        }
      );

      context?.setQuestFeed(((await Promise.all(promises)) || []) as Quest[]);
    } catch (err: any) {
      console.error(err.message);
    }
    setFeedLoading(false);
  };

  const getMoreQuestFeed = async () => {
    if (!questInfo.hasMore || !questInfo.cursor) return;
    try {
      const data = await getQuests(25, questInfo?.cursor);

      if (data?.data?.questInstantiateds?.length !== 25) {
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

      const promises = data?.data?.questInstantiateds?.map(
        async (item: any) => {
          let post;
          const res = await fetchPost(
            context?.lensConectado?.sessionClient ?? context?.clienteLens!,
            {
              post: item?.postId,
            }
          );

          if (!item?.questMetadata) {
            let data = await fetchIPFSJSON(item?.uri);
            item = {
              ...item,
              questMetadata: data,
            };
          }

          if (res?.isOk()) {
            post = res?.value as Post;
          }

          return {
            ...item,
            post,
          };
        }
      );

      const newQuests = ((await Promise.all(promises)) || []) as Quest[];

      context?.setQuestFeed((prev) => [...prev, ...newQuests]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (
      Number(context?.questFeed?.length) < 1 &&
      (context?.clienteLens ?? context?.lensConectado?.sessionClient)
    ) {
      getQuestFeed();
    }
  }, [context?.lensConectado, context?.clienteLens]);

  return {
    feedLoading,
    getMoreQuestFeed,
    questInfo,
  };
};

export default useFeed;
