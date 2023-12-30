import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";

export const getQuest = async (
  questId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($questId: String, $first: Int, $skip: Int) {
      questInstantiateds(where: {questId: $questId}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
          questInstantiateds {
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
              details
              milestoneId
              rewards {
                amount
                tokenAddress
                uri
                type
              }
              rewardsLength
              videoLength
              videos {
                videoBytes
                react
                quote
                pubId
                profileId
                playerId
                minPlayCount
                mirror
                minImpressionCount
                minEngagementRate
                minDuration
                minCTR
                minAVD
                comment
                bookmark
              }
            }
            questId
            transactionHash
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
                pubId
                profileId
                playCount
                mostViewedSegment
                mostReplayedArea
                interactionRate
                impressionCount
                hasReacted
                hasQuoted
                hasMirrored
                hasCommented
                hasBookmarked
                engagementRate
                duration
                ctr
                avd
              }
            }
        }
      }
    }
  `),
    variables: {
        questId
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
