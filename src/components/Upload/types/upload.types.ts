import { SetStateAction } from "react";
import {
  Erc20,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";

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
  availableCurrencies: Erc20[];
  postDetails: {
    title: string;
    description: string;
    video: string;
    tags: string;
    collectDetails: SimpleCollectOpenActionModuleInput;
  };
  setPostDetails: (
    e: SetStateAction<{
      title: string;
      description: string;
      video: string;
      tags: string;
      collectDetails: SimpleCollectOpenActionModuleInput;
    }>
  ) => void;
};
