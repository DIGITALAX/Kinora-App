import { FetchResult, gql } from "@apollo/client";
import { graphKinoraClient } from "../../lib/graph/client";
import serializeQuery from "../../lib/helpers/serializeQuery";

export const getQuestSearch = async (
  where: Object,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphKinoraClient.query({
    query: gql(`
    query($first: Int, $skip: Int) {
        questInstantiateds(where: {${serializeQuery(
          where
        )}}, first: $first, skip: $skip) {
          questMetadata {
            id
            title
            description
            cover
            videoCovers
          }
          uri
          questId
          pubId
          profileId
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
