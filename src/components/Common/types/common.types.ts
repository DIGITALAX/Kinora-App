import { Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";

export type QuestFeedProps = {
  questFeed: Post[];
  questInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  getMoreQuestFeed: () => Promise<void>;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
};

export type QuestPreviewProps = {
  quest: Post;
  height: string;
  width: string;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  questFeed: Post[];
  setItemFeed?: (e: SetStateAction<Post[]>) => void;
};

export type SaveQuestProps = {
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  questSaved: boolean;
  questId: string;
  questFeed: Post[];
  setItemFeed?: (e: SetStateAction<Post[]>) => void;
};
