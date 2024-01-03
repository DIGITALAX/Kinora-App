import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../lib/graph/client";

const ORDERS = `
  query($buyer: String!) {
    orderCreateds(where: {buyer: $buyer}) {
        subOrderCollectionIds
    }
    nftonlyOrderCreateds(where: {buyer: $buyer}) {
      subOrderCollectionIds
  }
  }
`;

export const getOrders = async (
  buyer: `0x${string}`
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(ORDERS),
    variables: {
      buyer,
    },
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    timeoutId = setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  timeoutId && clearTimeout(timeoutId);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
