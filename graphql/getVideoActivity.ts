import { KINORA_QUEST_DATA } from "@/app/lib/constants";
import { graphKinoraClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

export const getVideoActivity = async (
  playerProfile: string,
  postId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($playerProfile: String, $postId: String, $contractAddress: String) {
        videoActivities(where: { postId: $postId, playerProfile: $playerProfile, contractAddress: $contractAddress}, first: 1) {
          avd
          duration
          hasBookmarked
          hasCommented
          hasMirrored
          hasQuoted
          hasReacted
          mostReplayedArea
          playCount
          postId
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
      playerProfile,
      postId,
      contractAddress: KINORA_QUEST_DATA,
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
