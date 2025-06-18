import pollResult from "@/app/lib/helpers/pollResult";
import { ModalContext } from "@/app/providers";
import { Post } from "@lens-protocol/client";
import {
  addReaction,
  bookmarkPost,
  executePostAction,
  repost,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { Indexar } from "../types/common.types";

const useInteractions = (dict: any, post: Post) => {
  const context = useContext(ModalContext);
  const [openMirrorChoice, setOpenMirrorChoice] = useState<boolean>(false);
  const [interactionsLoading, setInteractionsLoading] = useState<{
    collect: boolean;
    mirror: boolean;
    like: boolean;
    hide: boolean;
    bookmark: boolean;
  }>({
    collect: false,
    like: false,
    mirror: false,
    hide: false,
    bookmark: false,
  });
  const [interactions, setInteractions] = useState<{
    reposts: number;
    quotes: number;
    hasReposted: boolean;
    hasQuoted: boolean;
    upvotes: number;
    hasUpVoted: boolean;
    collects: number;
    hasSimpleCollected: boolean;
    bookmarks: number;
    hasBookmarked: boolean;
  }>({
    reposts: 0,
    quotes: 0,
    hasReposted: false,
    hasQuoted: false,
    upvotes: 0,
    hasUpVoted: false,
    collects: 0,
    hasSimpleCollected: false,
    bookmarks: 0,
    hasBookmarked: false,
  });

  const mirror = async (): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => ({
      ...prev,
      mirror: true,
    }));

    try {
      const res = await repost(context?.lensConectado?.sessionClient, {
        post: post?.id,
      });

      if (res.isOk()) {
        if ((res.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((res.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (res.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Success);
            setInteractions((prev) => ({
              ...prev,
              hasReposted: true,
              reposts: prev?.reposts + 1,
            }));
          } else {
            context?.setModalOpen(dict?.error);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactive);
          }, 3000);
        }
      } else {
        context?.setModalOpen?.(dict?.error);
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      mirror: false,
    }));
  };

  const collect = async () => {
    if (
      !context?.lensConectado?.profile ||
      post?.actions?.[0]?.__typename !== "SimpleCollectAction"
    )
      return;

    setInteractionsLoading((prev) => ({
      ...prev,
      collect: true,
    }));

    try {
      const data = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: post?.id,
          action: {
            simpleCollect: {
              selected: true,
            },
          },
        }
      );

      if (data.isOk()) {
        if ((data.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((data.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (data.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Success);
            setInteractions((prev) => ({
              ...prev,
              hasSimpleCollected: true,
              collects: prev?.collects + 1,
            }));
          } else {
            context?.setModalOpen(dict?.error);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactive);
          }, 3000);
        }
      }

      setInteractions((prev) => ({
        ...prev,
        hasSimpleCollected: true,
        collects: prev.collects + 1,
      }));
    } catch (err: any) {
      context?.setModalOpen(dict?.error);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      collect: false,
    }));
  };

  const like = async (): Promise<void> => {
    if (!context?.lensConectado?.sessionClient) return;
    setInteractionsLoading((prev) => ({
      ...prev,
      like: true,
    }));

    try {
      await addReaction(context?.lensConectado?.sessionClient, {
        post: post?.id,
        reaction: interactions?.hasUpVoted ? "DOWNVOTE" : "UPVOTE",
      });

      setInteractions((prev) => ({
        ...prev,
        hasUpvoted: prev?.hasUpVoted ? false : true,
        upvotes: prev?.hasUpVoted
          ? Number(prev?.upvotes) - 1
          : Number(prev?.upvotes) + 1,
      }));
    } catch (err: any) {
      console.error(err.message);
    }

    setInteractionsLoading((prev) => ({
      ...prev,
      like: false,
    }));
  };

  const handleBookmark = async () => {
    setInteractionsLoading((prev) => ({
      ...prev,
      bookmark: true,
    }));
    try {
      await bookmarkPost(context?.lensConectado?.sessionClient!, {
        post: post?.id,
      });

      setInteractions((prev) => ({
        ...prev,
        hasBookmarked: true,
        bookmarks: prev?.bookmarks + 1,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setInteractionsLoading((prev) => ({
      ...prev,
      bookmark: false,
    }));
  };

  useEffect(() => {
    if (post) {
      setInteractions({
        reposts: post?.stats?.reposts,
        quotes: post?.stats?.quotes,
        hasReposted: post?.operations?.hasReposted?.optimistic!,
        hasQuoted: post?.operations?.hasQuoted?.optimistic!,
        upvotes: post?.stats?.upvotes,
        hasUpVoted: post?.operations?.hasUpvoted!,
        collects: post?.stats?.collects,
        hasSimpleCollected: post?.operations?.hasSimpleCollected!,
        bookmarks: post?.stats?.bookmarks,
        hasBookmarked: post?.operations?.hasBookmarked!,
      });
    }
  }, [post]);

  return {
    openMirrorChoice,
    setOpenMirrorChoice,
    interactionsLoading,
    like,
    collect,
    handleBookmark,
    mirror,
    interactions,
  };
};

export default useInteractions;
