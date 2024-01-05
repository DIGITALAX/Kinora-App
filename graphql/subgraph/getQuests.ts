import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";

export const getQuests = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int) {
      questInstantiateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
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
          maxPlayerCount
          questId
          pubId
          profileId
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
  `),
    variables: {
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

export const getQuestsEnvoker = async (
  first: number,
  skip: number,
  profileId: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $profileId: Int) {
      questInstantiateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp, where: { profileId: $profileId }) {
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
          maxPlayerCount
          questId
          pubId
          profileId
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
  `),
    variables: {
      first,
      skip,
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


