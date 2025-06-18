import { KINORA_QUEST_DATA } from "@/app/lib/constants";
import { graphKinoraClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

export const getQuests = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $contractAddress: String) {
      questInstantiateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp, where: {contractAddress: $contractAddress}) {
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
            videoCovers
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
              postId
              quote
              react
            }
          }
          maxPlayerCount
          questId
          postId
          status
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
              postId
              secondaryCollectOnComment
              playCount
              mostReplayedArea
              hasQuoted
              hasReacted
              hasMirrored
              hasCommented
              hasBookmarked
              duration
              avd
              playerId
            }
          }
      }
    }
  `),
    variables: {
      first,
      skip,
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

export const getQuestsEnvoker = async (
  first: number,
  skip: number,
  envoker: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $envoker: String, $contractAddress: String) {
      questInstantiateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp, where: { envoker: $envoker, contractAddress: $contractAddress }) {
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
            videoCovers
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
              postId
              quote
              react
            }
          }
          maxPlayerCount
          questId
          postId
          transactionHash
          blockTimestamp
          uri
          status
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
              postId
              secondaryCollectOnComment
              playCount
              mostReplayedArea
              hasQuoted
              hasReacted
              hasMirrored
              hasCommented
              hasBookmarked
              duration
              avd
              playerId
            }
          }
      }
    }
  `),
    variables: {
      first,
      skip,
      envoker,
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
