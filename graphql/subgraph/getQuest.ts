import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";

export const getQuest = async (
  pubId: string,
  profileId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($pubId: String, $profileId: String) {
      questInstantiateds(where: {profileId: $profileId, pubId: $pubId}, first: 1, orderDirection: desc, orderBy: blockTimestamp) {
            gate {
              erc721Logic {
                uris
                tokenIds
                address
              }
              erc20Logic {
                address
                amount
              }
              oneOf
            }
            questMetadata {
              id
              title
              description
              cover
            }
            milestones {
              gated {
                erc721Logic {
                  uris
                  tokenIds
                  address
                }
                erc20Logic {
                  address
                  amount
                  id
                }
                oneOf
              }
              uri
              milestoneMetadata {
                title
                description
                cover
              }
              milestoneId
              rewards {
                amount
                tokenAddress
                uri
                rewardMetadata {
                  id
                  title
                  description
                  cover
                  mediaCover
                  images
                  video
                  mediaType
                  audio
                }
                type
              }
              rewardsLength
              videoLength
              videos {
                bookmark
                comment
                minAVD
                minDuration
                minPlayCount
                minSecondaryCollectOnQuote
                minSecondaryCollectOnComment
                minSecondaryCommentOnComment
                minSecondaryCommentOnQuote
                minSecondaryMirrorOnComment
                minSecondaryMirrorOnQuote
                minSecondaryQuoteOnComment
                minSecondaryQuoteOnQuote
                minSecondaryReactOnComment
                minSecondaryReactOnQuote
                mirror
                playerId
                profileId
                pubId
                quote
                react
                videoBytes
              }
            }
            maxPlayerCount
            questId
            pubId
            status
            profileId
            transactionHash
            blockTimestamp
            uri
            milestoneCount
            players {
              milestonesCompleted {
                questId
                milestonesCompleted
              }
              eligibile {
                milestone
                questId
                status
              }
              profileId
              questsCompleted
              questsJoined
              videos {
                secondaryReactOnQuote
                secondaryReactOnComment
                secondaryQuoteOnQuote
                secondaryQuoteOnComment
                secondaryMirrorOnQuote
                secondaryMirrorOnComment
                secondaryCommentOnQuote
                secondaryCommentOnComment
                secondaryCollectOnQuote
                pubId
                secondaryCollectOnComment
                playCount
                profileId
                mostReplayedArea
                hasQuoted
                hasReacted
                hasMirrored
                hasCommented
                hasBookmarked
                duration
                avd
              }
            }
      }
    }
  `),
    variables: {
      pubId,
      profileId,
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

export const getQuestById = async (
  questId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($questId: String) {
      questInstantiateds(where: {questId: $questId}, first: 1, orderDirection: desc, orderBy: blockTimestamp) {
            gate {
              erc721Logic {
                uris
                tokenIds
                address
              }
              erc20Logic {
                address
                amount
              }
              oneOf
            }
            questMetadata {
              id
              title
              description
              cover
            }
            milestones {
              gated {
                erc721Logic {
                  uris
                  tokenIds
                  address
                }
                erc20Logic {
                  address
                  amount
                  id
                }
                oneOf
              }
              uri
              milestoneMetadata {
                title
                description
                cover
              }
              milestoneId
              rewards {
                amount
                tokenAddress
                uri
                rewardMetadata {
                  id
                  title
                  description
                  cover
                  mediaCover
                  images
                  video
                  mediaType
                  audio
                }
                type
              }
              rewardsLength
              videoLength
              videos {
                bookmark
                comment
                minAVD
                minDuration
                minPlayCount
                minSecondaryCollectOnQuote
                minSecondaryCollectOnComment
                minSecondaryCommentOnComment
                minSecondaryCommentOnQuote
                minSecondaryMirrorOnComment
                minSecondaryMirrorOnQuote
                minSecondaryQuoteOnComment
                minSecondaryQuoteOnQuote
                minSecondaryReactOnComment
                minSecondaryReactOnQuote
                mirror
                playerId
                profileId
                pubId
                quote
                react
                videoBytes
              }
            }
            maxPlayerCount
            questId
            pubId
            status
            profileId
            transactionHash
            blockTimestamp
            uri
            milestoneCount
            players {
              milestonesCompleted {
                questId
                milestonesCompleted
              }
              eligibile {
                milestone
                questId
                status
              }
              profileId
              questsCompleted
              questsJoined
              videos {
                secondaryReactOnQuote
                secondaryReactOnComment
                secondaryQuoteOnQuote
                secondaryQuoteOnComment
                secondaryMirrorOnQuote
                secondaryMirrorOnComment
                secondaryCommentOnQuote
                secondaryCommentOnComment
                secondaryCollectOnQuote
                pubId
                secondaryCollectOnComment
                playCount
                profileId
                mostReplayedArea
                hasQuoted
                hasReacted
                hasMirrored
                hasCommented
                hasBookmarked
                duration
                avd
              }
            }
      }
    }
  `),
    variables: {
      questId,
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
