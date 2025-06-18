import { useContext, useEffect, useState } from "react";
import { Quest } from "../../Common/types/common.types";
import { getQuests } from "../../../../../graphql/getQuests";
import fetchIPFSJSON from "@/app/lib/helpers/fetchIPFSJSON";
import { fetchPost } from "@lens-protocol/client/actions";
import { ModalContext } from "@/app/providers";

const useSuggested = () => {
  const context = useContext(ModalContext);
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
            post = res?.value;
          }

          return {
            ...item,
            post,
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
            post = res?.value;
          }

          return {
            ...item,
            post,
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
    if (suggestedQuests?.length < 1 && context?.clienteLens) {
      getSuggested();
    }
  }, [context?.clienteLens, context?.lensConectado?.sessionClient]);

  return {
    suggestedLoading,
    getMoreSuggested,
    suggestedInfo,
    suggestedQuests,
  };
};

export default useSuggested;
