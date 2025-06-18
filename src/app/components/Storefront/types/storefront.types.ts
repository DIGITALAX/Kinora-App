import { SetStateAction } from "react";
import { Collection } from "../../Common/types/common.types";

export interface CartItem {
  item?: Collection;
  chosenSize?: string;
  chosenAmount?: number;
  chosenCurrency: string;
}

export interface Details {
  name: string;
  address: string;
  zip: string;
  city: string;
  state: string;
  country: string;
}

export type PrintProps = {
  dict: any;
  storeItems: Collection[];
  setStoreItems: (e: SetStateAction<Collection[]>) => void;
  storeLoading: boolean;
  chosenCartItem: CartItem | undefined;
  setChosenCartItem: (e: SetStateAction<CartItem | undefined>) => void;
};

export type CheckoutProps = {
  dict: any;
  handleApproveSpend: () => Promise<void>;
  approved: boolean;
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  fulfillmentDetails: Details;
  checkoutItem: () => Promise<void>;
  checkoutLoading: boolean;
  chosenCartItem: CartItem | undefined;
  setChosenCartItem: (e: SetStateAction<CartItem | undefined>) => void;
};

export type ShippingInfoProps = {
  setFulfillmentDetails: (e: SetStateAction<Details>) => void;
  fulfillmentDetails: Details;
  dict: any;
};
