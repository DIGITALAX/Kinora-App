import { Collection } from "@/components/Envoke/types/envoke.types";
import { SetStateAction } from "react";
import { Action, Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";

export interface Details {
  name: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export type PrintProps = {
  t: (key: string) => string;
  storeItems: (Collection & {
    chosenSize: string;
    chosenAmount: string;
  })[];
  setStoreItems: (
    e: SetStateAction<
      (Collection & {
        chosenSize: string;
        chosenAmount: string;
      })[]
    >
  ) => void;
  storeLoading: boolean;
  lensConnected: Profile | undefined;
  mirror: (id: string, main?: boolean) => Promise<void>;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  dispatch: Dispatch<Action>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
    collect: boolean;
  }[];
  mirrorChoiceOpen: boolean[];
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  chosenCartItem: CartItem | undefined;
  setChosenCartItem: (e: SetStateAction<CartItem | undefined>) => void;
};

export type CheckoutProps = {
  checkoutItem: () => Promise<void>;
  checkoutLoading: boolean;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  setCheckoutCurrency: (e: string) => void;
  checkoutCurrency: string;
  fulfillmentDetails: Details;
  chosenCartItem: CartItem | undefined;
  setChosenCartItem: (e: SetStateAction<CartItem | undefined>) => void;
  approved: boolean;
  t: (key: string) => string;
  walletConnected: boolean;
  handleApproveSpend: () => Promise<void>;
  openConnectModal: (() => void) | undefined;
  lensConnected: Profile | undefined;
  handleLogIn: () => Promise<void>;
  loginLoading: boolean;
  oracleData: OracleData[];
  dispatch: Dispatch<Action>;
};

export interface CartItem {
  item: Collection;
  chosenSize: string;
  chosenAmount: number;
}

export type ShippingInfoProps = {
  fulfillmentDetails: Details;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  t: (key: string) => string;
};

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

export interface AuthSig {
  sig: any;
  derivedVia: string;
  signedMessage: string;
  address: string;
}
