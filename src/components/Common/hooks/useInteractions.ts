import { Quest } from "@/components/Quest/types/quest.types";
import errorChoice from "../../../../lib/helpers/errorChoice";
import { Post, Profile, PublicationStats } from "../../../../graphql/generated";
import { setQuestFeed } from "../../../../redux/reducers/questFeedSlice";
import { Dispatch } from "redux";
import lensBookmark from "../../../../lib/helpers/lensBookmark";
import { SetStateAction, useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import lensMirror from "../../../../lib/helpers/lensMirror";
import lensLike from "../../../../lib/helpers/lensLike";
import refetchProfile from "../../../../lib/helpers/refetchProfile";
import lensFollow from "../../../../lib/helpers/lensFollow";
import lensUnfollow from "../../../../lib/helpers/lensUnfollow";
import { NextRouter } from "next/router";

const useInteractions = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  feed: (Quest | Post)[],
  address: `0x${string}` | undefined,
  publicClient: PublicClient,
  router: NextRouter,
  completed?: Quest[],
  envoked?: Quest[]
) => {
  const [mirrorChoiceOpen, setMirrorChoiceOpen] = useState<boolean[]>([]);
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
  const [mirrorChoiceOpenEnvoked, setMirrorChoiceOpenEnvoked] = useState<
    boolean[]
  >([]);
  const [mirrorChoiceOpenCompleted, setMirrorChoiceOpenCompleted] = useState<
    boolean[]
  >([]);
  const [profileHoversCompleted, setProfileHoversCompleted] = useState<
    boolean[]
  >([]);
  const [profileHoversEnvoked, setProfileHoversEnvoked] = useState<boolean[]>(
    []
  );
  const [interactionsLoadingCompleted, setInteractionsLoadingCompleted] =
    useState<
      {
        mirror: boolean;
        like: boolean;
        follow: boolean;
        unfollow: boolean;
        simpleCollect: boolean;
      }[]
    >([]);
  const [interactionsLoadingEnvoked, setInteractionsLoadingEnvoked] = useState<
    {
      mirror: boolean;
      like: boolean;
      follow: boolean;
      unfollow: boolean;
      simpleCollect: boolean;
    }[]
  >([]);

  const bookmark = async (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void)
  ) => {
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
        "bookmarks",
        feed,
        itemSetter
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
            feed,
            itemSetter
          ),
        dispatch
      );
    }
  };

  const mirror = async (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string,
    main?: boolean
  ) => {
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

    (type === "completed"
      ? setInteractionsLoadingCompleted
      : type == "envoked"
      ? setInteractionsLoadingEnvoked
      : setInteractionsLoading)((prev) => {
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
        "mirrors",
        feed,
        itemSetter
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
            feed,
            itemSetter
          ),
        dispatch
      );
    }

    (type === "completed"
      ? setInteractionsLoadingCompleted
      : type == "envoked"
      ? setInteractionsLoadingEnvoked
      : setInteractionsLoading)((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: false };
      return updatedArray;
    });
  };

  const like = async (
    id: string,
    hasReacted: boolean,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string,
    main?: boolean
  ) => {
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

    (type === "completed"
      ? setInteractionsLoadingCompleted
      : type == "envoked"
      ? setInteractionsLoadingEnvoked
      : setInteractionsLoading)((prev) => {
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
        "reactions",
        feed,
        itemSetter
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
            feed,
            itemSetter
          ),
        dispatch
      );
    }

    (type === "completed"
      ? setInteractionsLoadingCompleted
      : type == "envoked"
      ? setInteractionsLoadingEnvoked
      : setInteractionsLoading)((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: false };
      return updatedArray;
    });
  };

  const followProfile = async (id: string, index: number, type: string) => {
    if (!lensConnected?.id) return;

    if (index == -1) {
      return;
    }

    (type === "completed"
      ? setInteractionsLoadingCompleted
      : type == "envoked"
      ? setInteractionsLoadingEnvoked
      : setInteractionsLoading)((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], follow: true };
      return updatedArray;
    });

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

    (type === "completed"
      ? setInteractionsLoadingCompleted
      : type == "envoked"
      ? setInteractionsLoadingEnvoked
      : setInteractionsLoading)((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: false };
      return updatedArray;
    });
  };

  const unfollowProfile = async (id: string, index: number) => {
    if (!lensConnected?.id) return;

    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], unfollow: true };
      return updatedArray;
    });
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
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], unfollow: false };
      return updatedArray;
    });
  };

  const updateInteractions = (
    index: number,
    value: Object,
    type: string,
    feed: (Quest | Post)[],
    itemSetter?:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void)
  ) => {
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

    if (router.asPath.includes("/envoker/")) {
      itemSetter!(newItems as any[]);
    } else {
      dispatch(setQuestFeed(newItems as Quest[]));
    }
  };

  useEffect(() => {
    setMirrorChoiceOpenEnvoked(
      Array.from({ length: feed?.length }, () => false)
    );

    if (completed) {
      setMirrorChoiceOpenCompleted(
        Array.from({ length: completed?.length }, () => false)
      );
      setProfileHoversCompleted(
        Array.from({ length: completed?.length }, () => false)
      );
      setInteractionsLoadingCompleted(
        Array.from({ length: completed?.length }, () => ({
          mirror: false,
          simpleCollect: false,
          like: false,
          follow: false,
          unfollow: false,
        }))
      );
    }

    if (envoked) {
      setMirrorChoiceOpenEnvoked(
        Array.from({ length: envoked?.length }, () => false)
      );
      setProfileHoversEnvoked(
        Array.from({ length: envoked?.length }, () => false)
      );
      setInteractionsLoadingEnvoked(
        Array.from({ length: envoked?.length }, () => ({
          mirror: false,
          simpleCollect: false,
          like: false,
          follow: false,
          unfollow: false,
        }))
      );
    }

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
  }, [feed, completed, envoked]);

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
    setMirrorChoiceOpenEnvoked,
    mirrorChoiceOpenEnvoked,
    interactionsLoadingEnvoked,
    setMirrorChoiceOpenCompleted,
    mirrorChoiceOpenCompleted,
    interactionsLoadingCompleted,
    setProfileHoversCompleted,
    setProfileHoversEnvoked,
    profileHoversCompleted,
    profileHoversEnvoked,
  };
};

export default useInteractions;
