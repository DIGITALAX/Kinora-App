import { FetchResult, gql } from "@apollo/client";
import { graphPrintClient } from "../../lib/graph/client";

export const getAllCollections = async (
  title: string,
  dropTitle: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $title: String, $dropTitle: String) {
      collectionCreateds(where: { or: [{collectionMetadata_: { title_starts_with_nocase: $title }}, {collectionMetadata_: { title_ends_with_nocase: $title }}, {collectionMetadata_: { prompt_contains_nocase: $title }}, {dropMetadata_: { dropTitle_contains_nocase: $dropTitle }}]}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
        collectionId
        dropMetadata {
          dropCover
          dropTitle
        }
        collectionMetadata {
          title
          mediaCover
          images
        }
        uri
        profileId
      }
    }
  `),
    variables: {
      first,
      skip,
      title,
      dropTitle,
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

export const getCollectionSample = async (
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($first: Int, $skip: Int) {
      collectionCreateds(first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
        collectionId
        dropMetadata {
          dropCover
          dropTitle
        }
        collectionMetadata {
          title
          mediaCover
          images
        }
        origin
        uri
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

export const getCollectionURI = async (
  uri: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($uri: String) {
      collectionCreateds(first: 1, where: { uri_contains_nocase: $uri}, orderDirection: desc, orderBy: blockTimestamp) {
        collectionMetadata {
          title
          mediaCover
          images
        }
        origin
      }
    }
  `),
    variables: {
      uri,
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

export const getCollectionId = async (
  collectionId: string
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($collectionId: String) {
      collectionCreateds(first: 1, where: { collectionId: $collectionId}, orderDirection: desc, orderBy: blockTimestamp) {
        collectionMetadata {
          title
          mediaCover
          images
        }
        origin
      }
    }
  `),
    variables: {
      collectionId,
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
