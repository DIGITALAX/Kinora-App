import { SetStateAction } from "react";
import {
  Erc20,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";
import { Action, Dispatch } from "redux";

export type CollectOptionsProps = {
  openMeasure: {
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
  t: (key: string) => string
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
  border?: boolean;
  gifs?:
    | {
        [key: string]: string[];
      }
    | undefined;
};
