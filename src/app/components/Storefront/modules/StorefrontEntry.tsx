"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import useCheckout from "../hooks/useCheckout";
import Prints from "./Prints";
import Checkout from "./Checkout";

export default function StorefrontEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  const {
    storeLoading,
    storeItems,
    checkoutItem,
    checkoutLoading,
    fulfillmentDetails,
    setFulfillmentDetails,
    chosenCartItem,
    setChosenCartItem,
    handleApproveSpend,
    approved,
    setStoreItems,
  } = useCheckout(dict);

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5 font-bit text-white"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col"
        style={{
          width:
            typeof window !== "undefined" &&
            window.innerWidth > 684 &&
            context?.openSidebar
              ? "calc(100vw - 10rem)"
              : "calc(100vw - 2.5rem)",
        }}
        id={!context?.openSidebar ? "closeSide" : ""}
      >
        <div className="relative w-fit h-fit flex items-start justify-start text-2xl pb-10">
          {dict?.shop}
        </div>
        <div className="relative w-full h-full flex items-start justify-start flex-col md:flex-row text-xs gap-4 pb-3">
          <Prints
            dict={dict}
            setStoreItems={setStoreItems}
            storeLoading={storeLoading}
            storeItems={storeItems}
            chosenCartItem={chosenCartItem}
            setChosenCartItem={setChosenCartItem}
          />
          <Checkout
            dict={dict}
            chosenCartItem={chosenCartItem}
            setChosenCartItem={setChosenCartItem}
            handleApproveSpend={handleApproveSpend}
            approved={approved}
            checkoutItem={checkoutItem}
            checkoutLoading={checkoutLoading}
            fulfillmentDetails={fulfillmentDetails}
            setFulfillmentDetails={setFulfillmentDetails}
          />
        </div>
      </div>
    </div>
  );
}
