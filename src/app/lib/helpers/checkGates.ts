import { Collection, Gate } from "@/app/components/Common/types/common.types";
import { PublicClient } from "viem";
import { getCollectionId } from "../../../../graphql/getAllCollections";
import { getOrders } from "../../../../graphql/getOrders";

const checkGates = async (
  gates: Gate,
  publicClient: PublicClient,
  address: `0x${string}`
): Promise<
  | {
      erc721?: Collection[];
      erc20?: {
        address: string;
        amount: string;
      }[];
    }
  | undefined
> => {
  try {
    let erc20s: {
      address: string;
      amount: string;
    }[] = [];
    let erc721s: Collection[] = [];

    if (gates?.erc20Logic?.length > 0) {
      const promises = gates?.erc20Logic?.map(async (item) => {
        const data = await publicClient.readContract({
          address: item.address as `0x${string}`,
          abi: [
            {
              inputs: [
                { internalType: "address", name: "account", type: "address" },
              ],
              name: "balanceOf",
              outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
              stateMutability: "view",
              type: "function",
            },
          ],
          functionName: "balanceOf",
          args: [address],
          account: address,
        });

        if (Number(item?.amount) > Number(data)) {
          erc20s.push(item);
        }
      });

      await Promise.all(promises);

      if (
        (!gates?.oneOf && erc20s?.length > 0) ||
        (gates?.oneOf &&
          gates?.erc721Logic?.length < 1 &&
          erc20s?.length == gates?.erc20Logic?.length)
      ) {
        return {
          erc20: erc20s,
        };
      }
    }

    if (gates?.erc721Logic?.length > 0) {
      const orders = await getOrders(address);

      if (orders?.data?.orderCreateds?.length > 0) {
        let collectionURIs: Collection[] = [];
        const promises = [...(orders?.data?.orderCreateds || [])]?.map(
          (item: { collections: { collectionId: string }[] }) =>
            item?.collections?.map(async (item: { collectionId: string }) => {
              const data = await getCollectionId(item?.collectionId);
              if (data?.data?.collectionCreateds?.[0]) {
                collectionURIs?.push(data?.data?.collectionCreateds?.[0]);
              }
            })
        );

        await Promise.all(promises);

        if (collectionURIs?.length < 1) {
          return {
            erc20: erc20s,
            erc721: gates?.erc721Logic,
          };
        } else {
          gates?.erc721Logic?.map((logic) => {
            const found = collectionURIs?.find(
              (coll) => coll.uri?.toLowerCase() == logic?.uri?.toLowerCase()
            );
            if (!found) {
              erc721s.push(logic);
            }
          });

          if (erc721s?.length < 1) {
            return undefined;
          } else {
            return {
              erc20: erc20s,
              erc721: erc721s,
            };
          }
        }
      } else {
        return {
          erc20: erc20s,
          erc721: gates?.erc721Logic,
        };
      }
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

export default checkGates;
