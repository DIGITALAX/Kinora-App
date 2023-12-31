import { Quest } from "@/components/Quest/types/quest.types";
import errorChoice from "../../../../lib/helpers/errorChoice";
import {
  Comment,
  Post,
  Profile,
  PublicationStats,
  SimpleCollectOpenActionSettings,
} from "../../../../graphql/generated";
import { Dispatch } from "redux";
import lensBookmark from "../../../../lib/helpers/lensBookmark";
import { useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import lensMirror from "../../../../lib/helpers/lensMirror";
import lensLike from "../../../../lib/helpers/lensLike";
import refetchProfile from "../../../../lib/helpers/refetchProfile";
import lensFollow from "../../../../lib/helpers/lensFollow";
import lensUnfollow from "../../../../lib/helpers/lensUnfollow";
import { setFollowCollect } from "../../../../redux/reducers/followCollectSlice";
import lensCollect from "../../../../lib/helpers/lensCollect";

const useInteractions = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  feed: (Quest | Post)[],
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  itemSetter: (e: Quest[] | (Quest & { type: string }[])) => void
) => {
  const [mirrorChoiceOpen, setMirrorChoiceOpen] = useState<boolean[]>([]);
  const [mainInteractionsLoading, setMainInteractionsLoading] = useState<{
    follow: boolean;
    unfollow: boolean;
  }>({
    follow: false,
    unfollow: false,
  });
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      like: boolean;
      follow: boolean;
      unfollow: boolean;
      simpleCollect: boolean;
    }[]
  >([]);

  const bookmark = async (id: string) => {
    if (!lensConnected?.id) return;

    const index = feed?.findIndex(
      (pub) =>
        (!(pub as Quest)?.publication
          ? (pub as Post)?.id
          : (pub as Quest)?.publication?.id) === id
    );

    if (index == -1) {
      return;
    }

    try {
      await lensBookmark(id, dispatch);
      updateInteractions(
        index,
        {
          hasBookmarked: true,
        },
        "bookmarks"
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
            "bookmarks"
          ),
        dispatch
      );
    }
  };

  const mirror = async (id: string, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex(
        (pub) =>
          (!(pub as Quest)?.publication
            ? (pub as Post)?.id
            : (pub as Quest)?.publication?.id) === id
      );

      if (index == -1) {
        return;
      }
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
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
        "mirrors"
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
            "mirrors"
          ),
        dispatch
      );
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: false };
      return updatedArray;
    });
  };

  const simpleCollect = async (post: Post | Comment) => {
    if (!lensConnected?.id) return;

    if (
      (post?.openActionModules?.[0] as SimpleCollectOpenActionSettings)
        ?.amount &&
      Number(
        (post?.openActionModules?.[0] as SimpleCollectOpenActionSettings)
          ?.amount?.value
      ) > 0
    ) {
      dispatch(
        setFollowCollect({
          actionType: "collect",
          actionCollect: {
            id: post?.id,
            stats: post?.stats?.countOpenActions,
            item: post?.openActionModules?.[0],
          },
        })
      );
      return;
    }

    const index = feed?.findIndex(
      (pub) =>
        (!(pub as Quest)?.publication
          ? (pub as Post)?.id
          : (pub as Quest)?.publication?.id) === post?.id
    );

    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], simpleCollect: true };
      return updatedArray;
    });

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensCollect(
        post?.id,
        post?.openActionModules?.[0]?.type!,
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
        "countOpenActions"
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
            "countOpenActions"
          ),
        dispatch
      );
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], simpleCollect: false };
      return updatedArray;
    });
  };

  const like = async (id: string, hasReacted: boolean, main?: boolean) => {
    if (!lensConnected?.id) return;

    let index = 0;

    if (!main) {
      index = feed?.findIndex(
        (pub) =>
          (!(pub as Quest)?.publication
            ? (pub as Post)?.id
            : (pub as Quest)?.publication?.id) === id
      );

      if (index == -1) {
        return;
      }
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: true };
      return updatedArray;
    });

    try {
      await lensLike(id, dispatch, hasReacted!);
      updateInteractions(
        index!,
        {
          hasReacted: hasReacted ? false : true,
        },
        "reactions"
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
            "reactions"
          ),
        dispatch
      );
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: false };
      return updatedArray;
    });
  };

  const followProfile = async (id: string, index: number, main?: boolean) => {
    if (!lensConnected?.id) return;

    if (index == -1) {
      return;
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        follow: true,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], follow: true };
        return updatedArray;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
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
      errorChoice(err, () => {}, dispatch);
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        follow: false,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], like: false };
        return updatedArray;
      });
    }
  };

  const unfollowProfile = async (id: string, index: number, main?: boolean) => {
    if (!lensConnected?.id) return;

    if (index == -1) {
      return;
    }

    if (main) {
      setMainInteractionsLoading((prev) => ({
        ...prev,
        unfollow: true,
      }));
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], unfollow: true };
        return updatedArray;
      });
    }

    try {
      const clientWallet = createWalletClient({
        chain: polygonMumbai,
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
      errorChoice(err, () => {}, dispatch);
    }
    if (main) {
      setMainInteractionsLoading((prev) => ({ ...prev, unfollow: false }));
    } else {
      setInteractionsLoading((prev) => {
        const updatedArray = [...prev];
        updatedArray[index!] = { ...updatedArray[index!], unfollow: false };
        return updatedArray;
      });
    }
  };

  const updateInteractions = (index: number, value: Object, type: string) => {
    const newItems = [...feed];

    if (index !== -1 && (newItems[index] as Quest)?.publication) {
      newItems[index] = {
        ...newItems[index],
        publication: {
          ...(newItems[index] as Quest)?.publication,
          operations: {
            ...(newItems[index] as Quest)?.publication?.operations,
            ...value,
          },
          stats: {
            ...(newItems[index] as Quest)?.publication?.stats,
            [type]:
              (newItems[index] as Quest)?.publication?.stats?.[
                type as keyof PublicationStats
              ] + 1,
          },
        },
      };
    } else if (!(newItems[index] as Quest)?.publication && index !== -1) {
      newItems[index] = {
        ...(newItems[index] as Post),
        operations: {
          ...(newItems[index] as Post)?.operations,
          ...value,
        },
        stats: {
          ...(newItems[index] as Post)?.stats,
          [type]:
            (newItems[index] as Post)?.stats?.[type as keyof PublicationStats] +
            1,
        },
      } as Post;
    }

    itemSetter!(newItems as any[]);
  };

  useEffect(() => {
    if (feed) {
      setInteractionsLoading(
        Array.from({ length: feed?.length }, () => ({
          mirror: false,
          simpleCollect: false,
          like: false,
          follow: false,
          unfollow: false,
        }))
      );
      setMirrorChoiceOpen(Array.from({ length: feed?.length }, () => false));
      setProfileHovers(Array.from({ length: feed?.length }, () => false));
    }
  }, [feed]);

  return {
    mirror,
    like,
    bookmark,
    interactionsLoading,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    profileHovers,
    setProfileHovers,
    followProfile,
    unfollowProfile,
    mainInteractionsLoading,
    simpleCollect,
  };
};

export default useInteractions;
