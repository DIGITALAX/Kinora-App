import { ModalContext } from "@/app/providers";
import {
  Post,
  Account,
  PageSize,
  PostReferenceType,
  PostReactionType,
} from "@lens-protocol/client";
import { useContext, useEffect, useState } from "react";
import { Video, VideoActivity } from "../../Common/types/common.types";
import { SocialType } from "../types/video.types";
import {
  fetchPostReactions,
  fetchPostReferences,
  fetchWhoExecutedActionOnPost,
} from "@lens-protocol/client/actions";
import { KINORA_OPEN_ACTION } from "@/app/lib/constants";

const useWho = (
  questId: string,
  socialType: SocialType,
  videoPlaying: Video | VideoActivity | undefined
) => {
  const context = useContext(ModalContext);
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [reactors, setReactors] = useState<Account[]>([]);
  const [quoters, setQuoters] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreQuote, setHasMoreQuote] = useState<boolean>(true);
  const [pageInfo, setPageInfo] = useState<string>();
  const [pageInfoQuote, setPageInfoQuote] = useState<string>();
  const [mirrorQuote, setMirrorQuote] = useState<boolean>(false);

  const showLikes = async () => {
    if (!videoPlaying?.post) return;
    setDataLoading(true);
    try {
      const data = await fetchPostReactions(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          post: videoPlaying?.post,
          pageSize: PageSize.Ten,
          filter: {
            anyOf: [PostReactionType.Upvote],
          },
        }
      );

      if (!data?.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors(
        (data?.value?.items?.map((item) => item?.account) as Account[]) || []
      );
      setPageInfo(data?.value?.pageInfo?.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMirrorQuotes = async () => {
    if (!videoPlaying?.post) return;

    setDataLoading(true);

    try {
      const mirrorData = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          referencedPost: videoPlaying?.post,
          referenceTypes: [PostReferenceType.RepostOf],
        }
      );

      if (!mirrorData?.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors(
        (mirrorData?.value?.items?.map((item) => item?.author) || []) as any[]
      );
      setPageInfo(mirrorData?.value?.pageInfo?.next!);
      if (!mirrorData?.value?.items || mirrorData?.value?.items?.length < 10) {
        setHasMore(false);
      } else if (mirrorData?.value?.items?.length === 10) {
        setHasMore(true);
      }

      const quoteData = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          referencedPost: videoPlaying?.post,
          referenceTypes: [PostReferenceType.QuoteOf],
        }
      );

      if (!quoteData?.isOk()) {
        setDataLoading(false);
        return;
      }

      setQuoters((quoteData?.value?.items || []) as Post[]);
      setPageInfoQuote(quoteData?.value.pageInfo.next!);

      if (!quoteData?.value?.items || quoteData?.value?.items?.length < 10) {
        setHasMoreQuote(false);
        setDataLoading(false);
      } else if (quoteData?.value?.items?.length === 10) {
        setHasMoreQuote(true);
      }

      if (
        (mirrorData?.value?.items || [])?.length < 1 &&
        (quoteData?.value?.items || [])?.length > 0
      ) {
        setMirrorQuote(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreLikes = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await fetchPostReactions(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          cursor: pageInfo,
          post: videoPlaying?.post,
          pageSize: PageSize.Ten,
          filter: {
            anyOf: [PostReactionType.Upvote],
          },
        }
      );

      if (!data?.isOk()) {
        setDataLoading(false);
        return;
      }
      setReactors([
        ...reactors,
        ...((data?.value?.items?.map((item) => item?.account) as Account[]) ||
          [] ||
          []),
      ]);
      setPageInfo(data?.value.pageInfo.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreQuoteMirrors = async () => {
    if ((!pageInfo || !hasMore) && (!pageInfoQuote || !hasMoreQuote)) return;

    try {
      if (hasMore && pageInfo) {
        const mirrorData = await fetchPostReferences(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            cursor: pageInfo,
            pageSize: PageSize.Ten,
            referencedPost: videoPlaying?.post,
            referenceTypes: [PostReferenceType.RepostOf],
          }
        );

        if (!mirrorData.isOk()) {
          return;
        }

        setReactors([
          ...reactors,
          ...(mirrorData?.value?.items?.map((item) => item?.author) || []),
        ]);
        setPageInfo(mirrorData?.value.pageInfo.next!);

        if (
          !mirrorData?.value?.items ||
          mirrorData?.value?.items?.length < 10
        ) {
          setHasMore(false);
          return;
        } else if (mirrorData?.value?.items?.length === 10) {
          setHasMore(true);
        }
      }

      if (pageInfoQuote && hasMoreQuote) {
        const quoteData = await fetchPostReferences(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            cursor: pageInfo,
            pageSize: PageSize.Ten,
            referencedPost: videoPlaying?.post,
            referenceTypes: [PostReferenceType.QuoteOf],
          }
        );

        if (!quoteData.isOk()) {
          return;
        }

        setQuoters([
          ...quoters,
          ...((quoteData?.value?.items || []) as Post[]),
        ]);
        setPageInfoQuote(quoteData?.value.pageInfo.next!);

        if (!quoteData?.value?.items || quoteData?.value?.items?.length < 10) {
          setHasMoreQuote(false);
          return;
        } else if (quoteData?.value?.items?.length === 10) {
          setHasMoreQuote(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showComments = async () => {
    setDataLoading(true);
    try {
      const data = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          referenceTypes: [PostReferenceType.CommentOn],
          referencedPost: videoPlaying
            ? videoPlaying?.post?.id
            : questId,
        }
      );

      if (data.isOk()) {
        setQuoters((data?.value?.items as Post[]) || []);
        setPageInfo(data?.value?.pageInfo?.next!);

        if (data?.value?.items?.length < 10) {
          setHasMore(false);
          setDataLoading(false);
          return;
        } else if (data?.value?.items?.length === 10) {
          setHasMore(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreComments = async () => {
    if (!pageInfo || !hasMore) return;

    try {
      const data = await fetchPostReferences(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          cursor: pageInfo,
          pageSize: PageSize.Ten,
          referenceTypes: [PostReferenceType.CommentOn],
          referencedPost: videoPlaying
            ? videoPlaying?.post?.id
            : questId,
        }
      );

      if (data.isOk()) {
        setQuoters((prev) => [
          ...prev,
          ...((data?.value?.items as Post[]) || []),
        ]);
        setPageInfo(data?.value?.pageInfo?.next!);

        if (data?.value?.items?.length < 10) {
          setHasMore(false);
          setDataLoading(false);
          return;
        } else if (data?.value?.items?.length === 10) {
          setHasMore(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showActors = async () => {
    if (!videoPlaying?.post?.id) return;
    setDataLoading(true);
    try {
      const data = await fetchWhoExecutedActionOnPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          post: videoPlaying?.post?.id,
          filter: {
            anyOf: [
              {
                simpleCollect: true,
              },
              {
                address: KINORA_OPEN_ACTION,
              },
            ],
          },
        }
      );

      if (!data?.isOk()) {
        setDataLoading(false);
        return;
      }

      setReactors(
        (data?.value?.items?.map((item) => item?.account) || []) as any
      );
      setPageInfo(data?.value.pageInfo.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        setDataLoading(false);
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreActors = async () => {
    if (!pageInfo || !hasMore) return;

    try {
      const data = await fetchWhoExecutedActionOnPost(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          post: videoPlaying?.post?.id,
          cursor: pageInfo,
          filter: {
            anyOf: [
              {
                address: KINORA_OPEN_ACTION,
              },
              {
                simpleCollect: true,
              },
            ],
          },
        }
      );

      if (!data.isOk()) {
        return;
      }

      setReactors([
        ...reactors,
        ...((data?.value?.items?.map((item) => item?.account) as Account[]) ||
          [] ||
          []),
      ]);
      setPageInfo(data?.value?.pageInfo.next!);

      if (!data?.value?.items || data?.value?.items?.length < 10) {
        setHasMore(false);
        return;
      } else if (data?.value?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMore = () => {
    switch (socialType) {
      case SocialType.Reacts:
        showMoreLikes();
        break;

      case SocialType.Comments:
        showMoreComments();
        break;

      case SocialType.Mirrors:
        showMoreQuoteMirrors();
        break;

      case SocialType.Players:
        showMoreActors();
        break;
    }
  };

  useEffect(() => {
    switch (socialType) {
      case SocialType.Reacts:
        showLikes();
        break;

      case SocialType.Mirrors:
        showMirrorQuotes();
        break;

      case SocialType.Comments:
        showComments();
        break;

      case SocialType.Players:
        if (videoPlaying) {
          showActors();
        }

        break;
    }
  }, [socialType, videoPlaying]);

  return {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    mirrorQuote,
    setMirrorQuote,
  };
};

export default useWho;
