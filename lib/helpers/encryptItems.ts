import { encryptString } from "@lit-protocol/lit-node-client";
import { ILitNodeClient } from "@lit-protocol/types";
import { DIGITALAX_ADDRESS } from "../constants";
import {
  AuthSig,
  CartItem,
} from "@/components/Storefront/types/storefront.types";

export const encryptItems = async (
  client: ILitNodeClient,
  fulfillmentDetails: {
    name: string;
    address: string;
    zip: string;
    city: string;
    contact: string;
    chosenAmount: number;
    checkoutCurrency: string;
    state: string;
    country: string;
  },
  address: `0x${string}`,
  authSig: AuthSig,
  collection: CartItem
): Promise<
  | {
      pubId: string;
      data: string;
    }[]
  | undefined
> => {
  try {
    let encryptedItems: {
      pubId: string;
      data: string;
    }[] = [];

    let fulfillerEditions: any[] = [];
    fulfillerEditions.push({
      contractAddress: "",
      standardContractType: "",
      chain: "polygon",
      method: "",
      parameters: [":userAddress"],
      returnValueTest: {
        comparator: "=",
        value: address.toLowerCase(),
      },
    });

    fulfillerEditions.push({
      operator: "or",
    });

    const accessControlConditions = [
      ...fulfillerEditions,
      {
        contractAddress: "",
        standardContractType: "",
        chain: "polygon",
        method: "",
        parameters: [":userAddress"],
        returnValueTest: {
          comparator: "=",
          value: address?.toLowerCase() as string,
        },
      },
    ];

    const { checkoutCurrency, chosenAmount, ...rest } = fulfillmentDetails;

    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions,
        authSig,
        chain: "polygon",
        dataToEncrypt: JSON.stringify({
          ...rest,
          prices: [collection?.item?.prices[0]],
          types: ["listener"],
          amounts: [chosenAmount],
          collectionIds: [collection?.item?.collectionId],
          fulfillerAddress: [DIGITALAX_ADDRESS],
          origin: "3",
        }),
      },
      client!
    );

    encryptedItems.push({
      pubId: collection?.item?.pubId,
      data: JSON.stringify({
        ciphertext,
        dataToEncryptHash,
        accessControlConditions,
      }),
    });

    return encryptedItems;
  } catch (err: any) {
    console.error(err.message);
  }
};
