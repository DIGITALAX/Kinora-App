import { FunctionComponent } from "react";
import { CheckoutProps } from "../types/storefront.types";
import ShippingInfo from "./ShippingInfo";
import Image from "next/legacy/image";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "../../../../lib/constants";
import { ImCross } from "react-icons/im";
import { setSuccess } from "../../../../redux/reducers/successSlice";
import { AiOutlineLoading } from "react-icons/ai";

const Checkout: FunctionComponent<CheckoutProps> = ({
  checkoutItem,
  checkoutLoading,
  fulfillmentDetails,
  setFulfillmentDetails,
  chosenCartItem,
  setChosenCartItem,
  dispatch,
  t,
  checkoutCurrency,
  setCheckoutCurrency,
  oracleData,
  walletConnected,
  lensConnected,
  approved,
  handleApproveSpend,
  handleLogIn,
  loginLoading,
  openConnectModal,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-full flex md:max-w-[17rem] xl:max-w-[20rem] overflow-y-scroll`}
    >
      <div className="relative w-full flex h-full flex-col justify-between bg-black border border-cost rounded-sm p-2">
        <div className="relative w-full h-full flex items-center flex-col gap-5">
          <div className="uppercase text-xl font-vcr text-gray-200 px-1 flex items-start whitespace-nowrap justify-center w-fit h-fit">
            {t("items")}
          </div>
          <div className="relative w-full h-full flex overflow-y-scroll items-start justify-center">
            <div className="relative w-full h-fit flex flex-col gap-10 font-vcr items-center justify-center px-px xl:px-2">
              {!chosenCartItem ? (
                <div className="relative w-fit h-fit flex items-center justify-center text-center font-vcr text-girasol break-words text-xs opacity-70">
                  {t("add")}
                </div>
              ) : (
                <div className="flex flex-col justify-start h-fit items-center gap-3 w-full">
                  <div
                    className={`relative w-full h-12 flex flex-row gap-5 font-bit text-white text-xs justify-between items-center px-1.5 bg-ama/20 rounded-md`}
                  >
                    <div className="relative w-10 h-8 rounded-lg bg-cross flex items-center justify-center">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          chosenCartItem?.item?.collectionMetadata?.images?.[0]?.split(
                            "ipfs://"
                          )[1]
                        }`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                        draggable={false}
                      />
                    </div>
                    <div className="relative w-fit h-fit text-ama flex">
                      {"USD "}
                      {Number(chosenCartItem?.item?.prices?.[0]) *
                        Number(chosenCartItem?.chosenAmount)}
                    </div>
                    <div className="relative w-fit text-xxs h-fit text-ama flex">
                      {chosenCartItem?.chosenSize}
                    </div>
                    <div className="relative w-fit text-xxs h-fit text-ama flex">
                      {chosenCartItem?.chosenAmount}
                    </div>
                    <div className="relative w-fit h-full flex flex-row items-center justify-center gap-1.5">
                      <div
                        className={`relative w-4 h-4 flex items-center justify-center rotate-90 ${
                          Number(chosenCartItem?.item?.amount) ==
                          Number(chosenCartItem?.chosenAmount)
                            ? "opacity-70"
                            : "cursor-pointer active:scale-95"
                        }`}
                        onClick={() => {
                          if (
                            Number(chosenCartItem?.chosenAmount) + 1 >
                            Number(chosenCartItem?.item?.amount)
                          ) {
                            dispatch(
                              setSuccess({
                                open: true,
                                image:
                                  "QmdYGNBgENYrXbWobgQwexXkF6F5nAfGAN7YHZ8PARdfBJ",
                                text: t("eager"),
                              })
                            );
                            return;
                          }

                          setChosenCartItem((prev) => ({
                            ...prev!,
                            chosenAmount:
                              Number(prev?.chosenAmount!) + 1 >
                              Number(prev?.item?.amount!)
                                ? prev?.chosenAmount!
                                : prev?.chosenAmount! + 1,
                          }));
                        }}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/Qma3jm41B4zYQBxag5sJSmfZ45GNykVb8TX9cE3syLafz2`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                      <div
                        className="relative w-4 h-4 cursor-pointer active:scale-95 flex items-center justify-center rotate-90"
                        onClick={() => {
                          if (Number(chosenCartItem?.chosenAmount) - 1 == 0) {
                            setChosenCartItem(undefined);
                          } else {
                            setChosenCartItem((prev) => ({
                              ...prev!,
                              chosenAmount: Number(prev?.chosenAmount) - 1,
                            }));
                          }
                        }}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/QmcBVNVZWGBDcAxF4i564uSNGZrUvzhu5DKkXESvhY45m6`}
                          layout="fill"
                          draggable={false}
                        />
                      </div>
                    </div>
                    <div
                      className="ml-auto justify-end items-center w-fit h-fit flex cursor-pointer active:scale-95"
                      onClick={() => setChosenCartItem(undefined)}
                    >
                      <ImCross color="white" size={8} />
                    </div>
                  </div>
                </div>
              )}
              <ShippingInfo
                t={t}
                fulfillmentDetails={fulfillmentDetails}
                setFulfillmentDetails={setFulfillmentDetails}
              />
              <div className="relative justify-center items-center w-3/4  h-fit flex flex-row font-vcr text-sm text-acei text-girasol gap-3">
                <div className="relative w-fit h-fit">{t("tot")}</div>
                <div className="relative w-fit h-fit">
                  {`${
                    ACCEPTED_TOKENS.find(
                      (subArray) => subArray[1] === checkoutCurrency
                    )?.[1]
                  } `}{" "}
                  {chosenCartItem
                    ? (
                        (Number(chosenCartItem?.item?.prices?.[0]) *
                          Number(chosenCartItem?.chosenAmount) *
                          10 ** 18) /
                        Number(
                          oracleData?.find(
                            (oracle) =>
                              oracle.currency?.toLowerCase() ===
                              ACCEPTED_TOKENS?.find(
                                (item) => item?.[1] == checkoutCurrency
                              )?.[2]?.toLowerCase()
                          )?.rate
                        )
                      )?.toFixed(3)
                    : 0}
                </div>
              </div>
              <div className="relative flex flex-col gap-1.5 items-center justify-center">
                <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-white text-xs">
                  {t("choose")}
                </div>
                <div className="relative w-3/4 justify-start items-center flex flex-row gap-2">
                  {ACCEPTED_TOKENS?.map((item: string[], index: number) => {
                    return (
                      <div
                        className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95 ${
                          checkoutCurrency === item[1]
                            ? "opacity-50"
                            : "opacity-100"
                        }`}
                        key={index}
                        onClick={() => setCheckoutCurrency(item[1])}
                      >
                        <Image
                          src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                          className="flex"
                          draggable={false}
                          width={30}
                          height={35}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative w-full h-fit flex flex-col gap-1.5 items-center justify-center">
                <div
                  className={`relative w-3/4 h-10 border border-suave text-white font-vcr items-center justify-center flex ${
                    !checkoutLoading && "cursor-pointer active:scale-95"
                  }`}
                  onClick={
                    !walletConnected
                      ? openConnectModal
                      : walletConnected && !lensConnected
                      ? () => handleLogIn()
                      : approved
                      ? () =>
                          !checkoutLoading && !loginLoading && checkoutItem()
                      : () =>
                          !checkoutLoading &&
                          !loginLoading &&
                          handleApproveSpend()
                  }
                >
                  <div
                    className={`relative w-fit h-fit flex justify-center items-center ${
                      (checkoutLoading || loginLoading) && "animate-spin"
                    }`}
                  >
                    {checkoutLoading || loginLoading ? (
                      <AiOutlineLoading size={15} color={"white"} />
                    ) : !walletConnected ? (
                      t("conne")
                    ) : walletConnected && !lensConnected ? (
                      t("conneL")
                    ) : chosenCartItem ? (
                      !approved ? (
                        t("ap")
                      ) : (
                        t("out")
                      )
                    ) : (
                      t("addC")
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
