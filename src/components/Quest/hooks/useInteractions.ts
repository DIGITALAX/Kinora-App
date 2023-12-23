import { SetStateAction, useEffect, useState } from "react";
import getPublications from "../../../../graphql/lens/queries/publications";
import {
  Comment,
  LimitType,
  Mirror,
  Post,
  Profile,
  PublicationStats,
  Quote,
} from "../../../../graphql/generated";
import errorChoice from "../../../../lib/helpers/errorChoice";
import { Dispatch } from "redux";
import { polygon } from "viem/chains";
import { PublicClient, createWalletClient, custom } from "viem";
import { MakePostComment, Quest } from "../types/quest.types";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import lensFollow from "../../../../lib/helpers/lensFollow";
import refetchProfile from "../../../../lib/helpers/refetchProfile";
import lensMirror from "../../../../lib/helpers/lensMirror";
import lensLike from "../../../../lib/helpers/lensLike";
import lensComment from "../../../../lib/helpers/lensComment";
import lensBookmark from "../../../../lib/helpers/lensBookmark";
import lensHide from "../../../../lib/helpers/lensHide";
import lensCollect from "../../../../lib/helpers/lensCollect";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import lensUnfollow from "../../../../lib/helpers/lensUnfollow";

const useInteractions = (
  lensConnected: Profile | undefined,
  questId: string,
  dispatch: Dispatch,
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  postCollectGif: PostCollectGifState,
  setQuestInfo: (e: SetStateAction<Quest | undefined>) => void
) => {
  const [allComments, setAllComments] = useState<Comment[]>([]);
  const [makeComment, setMakeComment] = useState<MakePostComment[]>([]);
  const [allCommentsLoading, setAllCommentsLoading] = useState<boolean>(false);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([]);
  const [profilesOpenMain, setProfilesOpenMain] = useState<boolean[]>([false]);
  const [openInteractions, setOpenInteractions] = useState<boolean[]>([]);
  const [openItemMirrorChoice, setOpenItemMirrorChoice] = useState<boolean[]>(
    []
  );
  const [contentLoading, setContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([]);
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean[]>([]);
  const [commentsOpen, setCommentsOpen] = useState<boolean[]>([]);
  const [interactionsItemsLoading, setInteractionsItemsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      comment: boolean;
      simpleCollect: boolean;
      bookmark: boolean;
      hide: boolean;
      follow: boolean;
      unfollow: boolean;
    }[]
  >([]);
  const [mainMakeComment, setMainMakeComment] = useState<MakePostComment[]>([
    {
      content: "",
      images: [],
      videos: [],
    },
  ]);
  const [mainInteractionsLoading, setMainInteractionsLoading] = useState<
    {
      like: boolean;
      mirror: boolean;
      comment: boolean;
      simpleCollect: boolean;
      bookmark: boolean;
      hide: boolean;
      follow: boolean;
      unfollow: boolean;
    }[]
  >([
    {
      like: false,
      mirror: false,
      comment: false,
      simpleCollect: false,
      bookmark: false,
      hide: false,
      follow: false,
      unfollow: false,
    },
  ]);
  const [commentInfo, setCommentInfo] = useState<{
    hasMore: boolean;
    cursor: string | undefined;
  }>({
    hasMore: false,
    cursor: undefined,
  });

  const getComments = async () => {
    setAllCommentsLoading(true);
    try {
      const data = await getPublications(
        {
          where: {
            commentOn: {
              id: questId,
            },
          },
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );
      setAllComments((data?.data?.publications?.items || []) as Comment[]);

      if (data?.data?.publications?.items?.length != 10) {
        setCommentInfo({
          hasMore: false,
          cursor: undefined,
        });
      } else {
        setCommentInfo({
          hasMore: true,
          cursor: data?.data?.publications?.pageInfo?.next,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setAllCommentsLoading(false);
  };

  const handleMoreComments = async () => {
    if (!commentInfo?.hasMore) return;

    try {
      const data = await getPublications(
        {
          where: {
            commentOn: {
              id: questId,
            },
          },
          limit: LimitType.Ten,
          cursor: commentInfo?.cursor,
        },
        lensConnected?.id
      );
      setAllComments([
        ...allComments,
        ...((data?.data?.publications?.items || []) as Comment[]),
      ]);
      if (data?.data?.publications?.items?.length != 10) {
        setCommentInfo({
          hasMore: false,
          cursor: undefined,
        });
      } else {
        setCommentInfo({
          hasMore: true,
          cursor: data?.data?.publications?.pageInfo?.next,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleHidePost = async (id: string, index: number, main?: boolean) => {
    if (!lensConnected?.id) return;
    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], hide: true };
        return updatedArray;
      });
    } else {
      if (index == -1) {
        return;
      }

      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], hide: true };
        return updatedArray;
      });
    }
    try {
      await lensHide(id, dispatch);
    } catch (err: any) {
      errorChoice(err, () => {}, dispatch);
    }
    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], hide: false };
        return updatedArray;
      });
    } else {
      if (index == -1) {
        return;
      }

      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], hide: false };
        return updatedArray;
      });
    }
  };

  const handleBookmark = async (on: string, index: number, main?: boolean) => {
    if (!lensConnected?.id) return;
    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], bookmark: true };
        return updatedArray;
      });
    } else {
      if (index == -1) {
        return;
      }

      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], bookmark: true };
        return updatedArray;
      });
    }

    try {
      await lensBookmark(on, dispatch);
      updateInteractions(
        index,
        {
          hasBookmarked: true,
        },
        "bookmarks",
        true,
        main
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index,
            {
              hasBookmarked: true,
            },
            "bookmarks",
            true,
            main
          ),
        dispatch
      );
    }
    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], bookmark: false };
        return updatedArray;
      });
    } else {
      if (index == -1) {
        return;
      }

      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], bookmark: false };
        return updatedArray;
      });
    }
  };

  const simpleCollect = async (
    id: string,
    type: string,
    main: boolean,
    mirror?: string
  ) => {
    if (!lensConnected?.id) return;
    const index = main
      ? undefined
      : allComments?.findIndex((pub) => pub.id === id);
    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], simpleCollect: true };
        return updatedArray;
      });
    } else {
      if (index == -1) {
        return;
      }

      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], simpleCollect: true };
        return updatedArray;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        id,
        type,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      updateInteractions(
        index!,
        {
          hasActed: {
            __typename: "OptimisticStatusResult",
            isFinalisedOnchain: true,
            value: true,
          },
        },
        "countOpenActions",
        true,
        main
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index!,
            {
              hasActed: {
                __typename: "OptimisticStatusResult",
                isFinalisedOnchain: true,
                value: true,
              },
            },
            "countOpenActions",
            true,
            main
          ),
        dispatch
      );
    }

    if (main) {
      setMainInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[0] = { ...updatedArray[0], simpleCollect: false };
        return updatedArray;
      });
    } else {
      setInteractionsItemsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = {
          ...updatedArray[index!],
          simpleCollect: false,
        };
        return updatedArray;
      });
    }
  };

  const comment = async (id: string, main?: boolean, mirror?: string) => {
    if (!lensConnected?.id) return;
    let content: string | undefined,
      images:
        | {
            media: string;
            type: string;
          }[]
        | undefined,
      videos: string[] | undefined;

    const index = main
      ? undefined
      : allComments?.findIndex((pub) => pub.id === id);

    if (!main) {
      if (
        (!makeComment[index!]?.content &&
          !makeComment[index!]?.images &&
          !makeComment[index!]?.videos &&
          !postCollectGif?.gifs?.[id]) ||
        index == -1
      )
        return;
      content = makeComment[index!]?.content;
      images = makeComment[index!]?.images!;
      videos = makeComment[index!]?.videos!;
    } else {
      if (
        !mainMakeComment[0]?.content &&
        !mainMakeComment[0]?.images &&
        !mainMakeComment[0]?.videos &&
        !postCollectGif?.gifs?.[id]
      )
        return;
      content = mainMakeComment[0]?.content;
      images = mainMakeComment[0]?.images!;
      videos = mainMakeComment[0]?.videos!;
    }

    handleLoaders(true, main, index, "comment");

    try {
      const contentURI = await uploadPostContent(
        content?.trim() == "" ? " " : content,
        images || [],
        videos || [],
        [],
        postCollectGif?.gifs?.[id] || []
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensComment(
        id,
        contentURI?.string!,
        dispatch,
        postCollectGif?.collectTypes?.[id]
          ? [
              {
                collectOpenAction: {
                  simpleCollectOpenAction: postCollectGif?.collectTypes?.[id],
                },
              },
            ]
          : undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        () => clearComment(index, main)
      );
      updateInteractions(index!, {}, "comments", true, main);
      await getComments();
    } catch (err: any) {
      errorChoice(
        err,
        () => updateInteractions(index!, {}, "comments", true, main),
        dispatch
      );
    }

    handleLoaders(false, main, index, "comment");
  };

  const handleLoaders = (
    start: boolean,
    main: boolean | undefined,
    index: number | undefined,
    type: string
  ) => {
    if (start) {
      if (!main) {
        if (index === -1) {
          return;
        }

        setInteractionsItemsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = { ...updatedArray[index!], [type]: true };
          return updatedArray;
        });
      } else {
        setMainInteractionsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[0] = { ...updatedArray[0], [type]: true };
          return updatedArray;
        });
      }
    } else {
      if (!main) {
        setInteractionsItemsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[index!] = { ...updatedArray[index!], [type]: false };
          return updatedArray;
        });
      } else {
        setMainInteractionsLoading((prev) => {
          const updatedArray = [...prev];
          updatedArray[0] = { ...updatedArray[0], [type]: false };
          return updatedArray;
        });
      }
    }
  };

  const clearComment = async (
    index: number | undefined,
    main: boolean | undefined
  ) => {
    if (!main) {
      setMakeComment((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = {
          content: "",
          images: [],
          videos: [],
        };
        return updatedArray;
      });
      setCommentsOpen((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = !updatedArray[index!];
        return updatedArray;
      });
    } else {
      setMainMakeComment((prev) => {
        const updatedArr = [...prev];
        updatedArr[0] = {
          content: "",
          images: [],
          videos: [],
        };
        return updatedArr;
      });
    }
  };

  const mirror = async (id: string, main?: boolean, mirror?: string) => {
    if (!lensConnected?.id) return;
    const index = main
      ? undefined
      : allComments?.findIndex((pub) => pub.id === id);

    if (!main && index == -1) return;
    handleLoaders(true, main, index, "mirror");

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });
      await lensMirror(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      updateInteractions(
        index!,
        {
          hasMirrored: true,
        },
        "mirrors",
        true,
        main
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index!,
            {
              hasMirrored: true,
            },
            "mirrors",
            true,
            main
          ),
        dispatch
      );
    }

    handleLoaders(false, main, index, "mirror");
  };

  const like = async (id: string, hasReacted: boolean, main?: boolean) => {
    if (!lensConnected?.id) return;
    const index = main
      ? undefined
      : allComments?.findIndex((pub) => pub.id === id);
    if (!main && index == -1) return;
    handleLoaders(false, main, index, "like");
    try {
      await lensLike(id, dispatch, hasReacted);
      updateInteractions(
        index!,
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions",
        hasReacted ? false : true,
        main
      );
    } catch (err: any) {
      errorChoice(
        err,
        () =>
          updateInteractions(
            index!,
            {
              hasReacted: hasReacted ? false : true,
            },
            "reactions",
            hasReacted ? false : true,
            main
          ),
        dispatch
      );
    }

    handleLoaders(false, main, index, "like");
  };

  const updateInteractions = (
    index: number,
    valueToUpdate: Object,
    statToUpdate: string,
    increase: boolean,
    main?: boolean
  ) => {
    if (main) {
      setQuestInfo(
        (prev) =>
          ({
            ...(prev || {}),
            publication: {
              ...prev?.publication,
              operations: {
                ...prev?.publication?.operations,
                ...valueToUpdate,
              },
              stats: {
                ...prev?.publication?.stats,
                [statToUpdate]:
                  prev?.publication?.stats?.[
                    statToUpdate as keyof PublicationStats
                  ] + (increase ? 1 : -1),
              },
            } as Post,
          } as Quest)
      );
    } else {
      const newItems = [...allComments];
      newItems[index] = {
        ...newItems[index],
        operations: {
          ...(newItems[index] as Post).operations,
          ...valueToUpdate,
        },
        stats: {
          ...(newItems[index] as Post).stats,
          [statToUpdate]:
            (newItems[index] as Post).stats?.[
              statToUpdate as keyof PublicationStats
            ] + (increase ? 1 : -1),
        },
      };

      setAllComments(newItems);
    }
  };

  const followProfile = async (id: string, index?: number, main?: boolean) => {
    if (index == -1) return;
    handleLoaders(true, main, index, "follow");

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensFollow(
        id,
        dispatch,
        undefined,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) return;
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }
    handleLoaders(false, main, index, "follow");
  };

  const unfollowProfile = async (
    id: string,
    index?: number,
    main?: boolean
  ) => {
    handleLoaders(true, main, index, "unfollow");

    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      await lensUnfollow(
        id,
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient
      );
      await refetchProfile(dispatch, lensConnected?.id, lensConnected?.id);
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) return;
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }

    handleLoaders(false, main, index, "unfollow");
  };

  useEffect(() => {
    if (allComments?.length < 1 && questId) {
      getComments();
    }
  }, [questId, lensConnected?.id]);

  useEffect(() => {
    if (allComments?.length > 0) {
      setInteractionsItemsLoading(
        Array.from({ length: allComments.length }, () => ({
          like: false,
          mirror: false,
          comment: false,
          simpleCollect: false,
          bookmark: false,
          hide: false,
          unfollow: false,
          follow: false,
        }))
      );
      setOpenMoreOptions(
        Array.from({ length: allComments.length }, () => false)
      );
      setContentLoading(
        Array.from({ length: allComments.length }, () => ({
          image: false,
          video: false,
          gif: false,
        }))
      );
      setOpenItemMirrorChoice(
        Array.from({ length: allComments.length }, () => false)
      );
      setMakeComment(
        Array.from({ length: allComments.length }, () => ({
          content: "",
          images: [],
          videos: [],
        }))
      );
      setOpenInteractions(
        Array.from({ length: allComments.length }, () => false)
      );
      setCommentsOpen(Array.from({ length: allComments.length }, () => false));
      setProfilesOpen(Array.from({ length: allComments.length }, () => false));
    }
  }, [allComments?.length]);

  return {
    mirror,
    like,
    comment,
    followProfile,
    unfollowProfile,
    handleHidePost,
    interactionsItemsLoading,
    mainInteractionsLoading,
    allCommentsLoading,
    setMakeComment,
    handleMoreComments,
    commentInfo,
    openMoreOptions,
    commentsOpen,
    profilesOpenMain,
    setProfilesOpenMain,
  };
};

export default useInteractions;
