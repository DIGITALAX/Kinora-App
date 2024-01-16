import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";
import { KINORA_QUEST_DATA } from "../../lib/constants";

export const getCompletedMilestones = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $contractAddress: String) {
        milestoneCompleteds(where:{ contractAddress: $contractAddress }, first: $first, skip: $skip, orderBy: blockTimestamp) {
            questId
            playerProfileId
            milestone
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

export const getCompletedQuest = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
      query($first: Int, $skip: Int, $contractAddress: String) {
        questCompleteds(first: $first, skip: $skip, orderBy: blockTimestamp, where: {contractAddress: $contractAddress}) {
            questId
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
