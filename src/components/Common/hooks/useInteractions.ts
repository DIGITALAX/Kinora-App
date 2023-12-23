import { Quest } from "@/components/Quest/types/quest.types";
import errorChoice from "../../../../lib/helpers/errorChoice";
import { Profile, PublicationStats } from "../../../../graphql/generated";
import { setQuestFeed } from "../../../../redux/reducers/questFeedSlice";
import { Dispatch } from "redux";
import lensBookmark from "../../../../lib/helpers/lensBookmark";
import { useEffect, useState } from "react";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import lensMirror from "../../../../lib/helpers/lensMirror";
import lensLike from "../../../../lib/helpers/lensLike";
import refetchProfile from "../../../../lib/helpers/refetchProfile";
import lensFollow from "../../../../lib/helpers/lensFollow";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import lensUnfollow from "../../../../lib/helpers/lensUnfollow";

const useInteractions = (
  lensConnected: Profile | undefined,
  dispatch: Dispatch,
  feed: Quest[],
  address: `0x${string}` | undefined,
  publicClient: PublicClient
) => {
  const [mirrorChoiceOpen, setMirrorChoiceOpen] = useState<boolean[]>([]);
  const [profileHovers, setProfileHovers] = useState<boolean[]>([]);
  const [interactionsLoading, setInteractionsLoading] = useState<
    {
      mirror: boolean;
      like: boolean;
      follow: boolean;
      unfollow: boolean;
    }[]
  >([]);

  const bookmark = async (id: string) => {
    if (!lensConnected?.id) return;
    const index = feed?.findIndex((pub) => pub?.publication?.id === id);

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

  const mirror = async (id: string) => {
    if (!lensConnected?.id) return;
    const index = feed?.findIndex((pub) => pub?.publication?.id === id);

    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], mirror: true };
      return updatedArray;
    });

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

  const like = async (id: string, hasReacted: boolean) => {
    if (!lensConnected?.id) return;
    const index = feed?.findIndex((pub) => pub?.publication?.id === id);

    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], like: true };
      return updatedArray;
    });
    try {
      await lensLike(id, dispatch, hasReacted);
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
      updatedArray[index!] = { ...updatedArray[index!], like: true };
      return updatedArray;
    });
  };

  const followProfile = async (id: string, index: number) => {
    if (!lensConnected?.id) return;

    if (index == -1) {
      return;
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], follow: true };
      return updatedArray;
    });

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
      errorChoice(err, () => {}, dispatch);
    }

    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], follow: false };
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
      errorChoice(err, () => {}, dispatch);
    }
    setInteractionsLoading((prev) => {
      const updatedArray = [...prev];
      updatedArray[index!] = { ...updatedArray[index!], unfollow: false };
      return updatedArray;
    });
  };

  const updateInteractions = (index: number, value: Object, type: string) => {
    const newItems = [...feed];

    if (index !== -1) {
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
    }

    dispatch(setQuestFeed(newItems as Quest[]));
  };

  useEffect(() => {
    if (feed?.length > 0) {
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
  };
};

export default useInteractions;
