import { Action, Dispatch } from "redux";
import lensBookmark from "./lensBookmark";
import { Post, Profile } from "../../graphql/generated";
import errorChoice from "./errorChoice";
import { setQuestFeed } from "../../redux/reducers/questFeedSlice";
import { SetStateAction } from "react";

const handleSaveQuest = async (
  id: string,
  dispatch: Dispatch<Action>,
  lensConnected: Profile | undefined,
  questFeed: Post[],
  setItemFeed?: (e: SetStateAction<Post[]>) => void
) => {
  if (!lensConnected?.id) return;

  try {
    await lensBookmark(id, dispatch);
    updateInteractions(id, questFeed, dispatch, setItemFeed);
  } catch (err: any) {
    errorChoice(
      err,
      () => updateInteractions(id, questFeed, dispatch, setItemFeed),
      dispatch
    );
  }
};

const updateInteractions = (
  id: string,
  questFeed: Post[],
  dispatch: Dispatch<Action>,
  setItemFeed?: (e: SetStateAction<Post[]>) => void
) => {
  const newItems = [...questFeed];
  const index = newItems.findIndex((item) => item?.id == id);

  if (index !== -1) {
    newItems[index] = {
      ...newItems[index],
      operations: {
        ...(newItems[index] as Post).operations,
        ...{
          hasBookmarked: true,
        },
      },
      stats: {
        ...(newItems[index] as Post).stats,
        bookmarks: (newItems[index] as Post).stats?.bookmarks + 1,
      },
    };
  }

  if (setItemFeed) {
    setItemFeed(newItems);
  } else {
    dispatch(setQuestFeed(newItems));
  }
};

export default handleSaveQuest;
