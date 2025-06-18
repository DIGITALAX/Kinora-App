import { SetStateAction } from "react";
import { SimpleCollect } from "../../Common/types/common.types";

export type CollectOptionsProps = {
  dict: any;
  postDetails?: {
    title: string;
    description: string;
    video: string;
    tags: string;
    collectDetails: SimpleCollect;
  };
  setPostDetails?: (
    e: SetStateAction<{
      title: string;
      description: string;
      video: string;
      tags: string;
      collectDetails: SimpleCollect;
    }>
  ) => void;
  collect?: boolean;
  border?: boolean;
};
