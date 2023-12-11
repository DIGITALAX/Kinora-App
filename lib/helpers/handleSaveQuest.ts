import { Action, Dispatch } from "redux";
import lensBookmark from "./lensBookmark";
import { Post, Profile } from "../../graphql/generated";
import errorChoice from "./errorChoice";
import { setQuestFeed } from "../../redux/reducers/questFeedSlice";
import { SetStateAction } from "react";
import { Quest } from "@/components/Quest/types/quest.types";

const handleSaveQuest = async (
  id: string,
  dispatch: Dispatch<Action>,
  lensConnected: Profile | undefined,
  questFeed: Quest[] | Post[],
  setItemFeed?:
    | ((e: SetStateAction<Quest[]>) => void)
    | ((e: SetStateAction<Post[]>) => void),
  post?: boolean
) => {
  if (!lensConnected?.id) return;

  try {
    await lensBookmark(id, dispatch);
    updateInteractions(id, questFeed, dispatch, setItemFeed, post);
  } catch (err: any) {
    errorChoice(
      err,
      () => updateInteractions(id, questFeed, dispatch, setItemFeed, post),
      dispatch
    );
  }
};

const updateInteractions = (
  id: string,
  questFeed: Quest[] | Post[],
  dispatch: Dispatch<Action>,
  setItemFeed?:
    | ((e: SetStateAction<Quest[]>) => void)
    | ((e: SetStateAction<Post[]>) => void),
  post?: boolean
) => {
  const newItems = [...questFeed];
  const index = newItems.findIndex(
    (item) => (post ? (item as Post) : (item as Quest)?.publication)?.id == id
  );

  if (index !== -1) {
    if (post) {
      newItems[index] = {
        ...newItems[index],
        ...(newItems[index] as Post),
        operations: {
          ...(newItems[index] as Post)?.operations,
          ...{
            hasBookmarked: true,
          },
        },
        stats: {
          ...(newItems[index] as Post)?.stats,
          bookmarks: (newItems[index] as Post)?.stats?.bookmarks + 1,
        },
      };
    } else {
      newItems[index] = {
        ...newItems[index],
        publication: {
          ...(newItems[index] as Quest)?.publication,
          operations: {
            ...(newItems[index] as Quest)?.publication?.operations,
            ...{
              hasBookmarked: true,
            },
          },
          stats: {
            ...(newItems[index] as Quest)?.publication?.stats,
            bookmarks:
              (newItems[index] as Quest)?.publication?.stats?.bookmarks + 1,
          },
        },
      };
    }
  }

  if (setItemFeed) {
    setItemFeed(newItems as []);
  } else {
    dispatch(setQuestFeed(newItems as []));
  }
};

export default handleSaveQuest;
