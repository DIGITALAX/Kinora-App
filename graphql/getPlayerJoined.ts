import { KINORA_QUEST_DATA } from "@/app/lib/constants";
import { graphKinoraClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

export const getPlayerJoined = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $contractAddress: String) {
      playerJoinedQuests(first: $first, skip: $skip, orderBy: blockTimestamp, where: {contractAddress: $contractAddress}) {
            questId
            playerProfile
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
