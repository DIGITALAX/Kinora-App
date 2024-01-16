import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";
import { KINORA_QUEST_DATA } from "../../lib/constants";

export const getVideos = async (
  first: number,
  skip: number,
  pubId: number,
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $pubId: Int, $profileId: Int, $contractAddress: String) {
      videos(first: $first, skip: $skip, where: {pubId: $pubId, profileId: $profileId, contractAddress: $contractAddress}) {
        questId
      }
    }
  `),
    variables: {
      first,
      skip,
      pubId,
      profileId,
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

export const getVideoPlayerId = async (
  pubId: number,
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($pubId: Int, $profileId: Int, $contractAddress: String) {
      videos(where: {pubId: $pubId, profileId: $profileId, contractAddress: $contractAddress}) {
        playerId
        pubId
        profileId
        questId
      }
    }
  `),
    variables: {
      pubId,
      profileId,
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
