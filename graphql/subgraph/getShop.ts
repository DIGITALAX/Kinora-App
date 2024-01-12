import { gql } from "@apollo/client";
import { graphPrintClient } from "../../lib/graph/client";

const COLLECTIONS = `
query($dropTitle: String) {
  collectionCreateds(where: {dropMetadata_: {dropTitle: $dropTitle}}) {
    amount
    dropMetadata {
      dropCover
      dropTitle
    }
    collectionMetadata {
      access
      visibility
      video
      title
      tags
      sex
      onChromadin
      style
      prompt
      profileHandle
      sizes
      microbrand
      mediaTypes
      mediaCover
      id
      description
      audio
      colors
      communities
      images
      microbrandCover
    }
    pubId
    profileId
    acceptedTokens
    uri
    printType
    prices
    owner
    soldTokens
    fulfillerPercent
    fulfillerBase
    fulfiller
    designerPercent
    dropId
    dropCollectionIds
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
    variables: {
      dropTitle: "Kinora",
    },
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
