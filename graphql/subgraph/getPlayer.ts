import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";

export const getPlayerData = async (
  profileId: number,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($profileId: Int, $first: Int, $skip: Int) {
        players(where: {profileId: $profileId}, first: $first, skip: $skip) {
            questsCompleted
            questsJoined
        }
    }
  `),
    variables: {
      profileId,
      first,
      skip,
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
