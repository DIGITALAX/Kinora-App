import { graphPrintClient } from "@/app/lib/graph/client";
import { gql } from "@apollo/client";

const COLLECTIONS = `
query {
  collectionCreateds(where: {origin: "4"}) {
    amount
      drop {
        metadata {
          cover
          title
        }
          collections {
          collectionId
        }
        uri
      }
      metadata {
        access
        visibility
        video
        title
        onChromadin
        sex
        style
        tags
        prompt
        sizes
        microbrand
        mediaTypes
        mediaCover
        id
        description
        audio
        colors
        images
        microbrandCover
      }
      postId
      acceptedTokens
      uri
      printType
      price
      designer
      tokenIdsMinted
      dropId
      collectionId
      unlimited
      origin
      blockTimestamp
  }
}
`;

export const getAllStore = async (): Promise<any> => {
  const queryPromise = graphPrintClient.query({
    query: gql(COLLECTIONS),
    fetchPolicy: "no-cache",
    errorPolicy: "all",
  });

  const timeoutPromise = new Promise((resolve) => {
    setTimeout(() => {
      resolve({ timedOut: true });
    }, 60000); // 1 minute timeout
  });

  const result: any = await Promise.race([queryPromise, timeoutPromise]);
  if (result.timedOut) {
    return;
  } else {
    return result;
  }
};
