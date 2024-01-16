import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";
import { KINORA_QUEST_DATA } from "../../lib/constants";

export const getMetricsAdded = async (
    first: number,
    skip: number
  ): Promise<FetchResult | void> => {
    let timeoutId: NodeJS.Timeout | undefined;
    const queryPromise = graphKinoraClient.query({
      query: gql(`
      query($first: Int, $skip: Int, $contractAddress: String) {
        playerMetricsUpdateds(first: $first, skip: $skip, orderBy: blockTimestamp, where: {contractAddress: $contractAddress}) {
            videoPubId
            videoProfileId
            playerProfileId
            blockTimestamp
          }
      }
    `),
      variables: {
        first,
        skip,
        contractAddress: KINORA_QUEST_DATA
      },
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });
  
    const timeoutPromise = new Promise((resolve) => {
      timeoutId = setTimeout(() => {
        resolve({ timedOut: true });
      }, 60000);
      return () => clearTimeout(timeoutId);
    });
  
    const result: any = await Promise.race([queryPromise, timeoutPromise]);
  
    timeoutId && clearTimeout(timeoutId);
    if (result.timedOut) {
      return;
    } else {
      return result;
    }
  };