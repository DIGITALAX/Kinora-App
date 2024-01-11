import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";

export const getVideoActivity = async (
  playerProfileId: number,
  pubId: number,
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($playerProfileId: Int, $profileId: Int, $pubId: Int) {
        videoActivities(where: { pubId: $pubId, profileId: $profileId, playerProfileId: $playerProfileId}, first: 1) {
          avd
          duration
          hasBookmarked
          hasCommented
          hasMirrored
          hasQuoted
          hasReacted
          mostReplayedArea
          playCount
          profileId
          pubId
          secondaryCollectOnComment
          secondaryReactOnQuote
          secondaryQuoteOnQuote
          secondaryMirrorOnQuote
          secondaryMirrorOnComment
          secondaryCommentOnQuote
          secondaryCommentOnComment
          secondaryCollectOnQuote
          secondaryQuoteOnComment
          secondaryReactOnComment
          playerId
        }
    }
  `),
    variables: {
      playerProfileId,
      profileId,
      pubId,
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
