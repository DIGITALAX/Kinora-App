import { SetStateAction } from "react";
import {
  Erc20,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";
import { Action, Dispatch } from "redux";

export type CollectOptionsProps = {
  openMeasure: {
    collectibleOpen: boolean;
    collectible: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      collectibleOpen: boolean;
      collectible: string;
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  id?: string;
  collectTypes?:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
  availableCurrencies: Erc20[];
  postDetails?: {
    title: string;
    description: string;
    video: string;
    tags: string;
    collectDetails: SimpleCollectOpenActionModuleInput;
  };
  setPostDetails?: (
    e: SetStateAction<{
      title: string;
      description: string;
      video: string;
      tags: string;
      collectDetails: SimpleCollectOpenActionModuleInput;
    }>
  ) => void;
  dispatch?: Dispatch<Action>;
  collect?: boolean;
  type?: string;
  gifs?:
    | {
        [key: string]: string[];
      }
    | undefined;
};
