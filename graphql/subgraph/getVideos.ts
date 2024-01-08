import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";

export const getVideos = async (
  first: number,
  skip: number,
  pubId: number,
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $pubId: Int, $profileId: Int) {
      videos(first: $first, skip: $skip, where: {pubId: $pubId, profileId: $profileId}) {
        questId
      }
    }
  `),
    variables: {
      first,
      skip,
      pubId,
      profileId
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