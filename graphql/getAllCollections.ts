import { graphPrintClient } from "@/app/lib/graph/client";
import { FetchResult, gql } from "@apollo/client";

export const getAllCollections = async (
  title: string,
  first: number,
  skip: number
): Promise<FetchResult | void> => {
  let timeoutId: NodeJS.Timeout | undefined;
  const queryPromise = graphPrintClient.query({
    query: gql(`
    query($first: Int, $skip: Int, $title: String) {
      collectionCreateds(where: { or: [{metadata_: { title_contains_nocase: $title }}, {metadata_: { microbrand_contains_nocase: $title }}, {metadata_: { prompt_contains_nocase: $title }}, {metadata_: { tags_contains_nocase: $title }}, {dropMetadata_: { title_contains_nocase: $title }}]}, first: $first, skip: $skip, orderDirection: desc, orderBy: blockTimestamp) {
        collectionId
        drop {
          metadata {
            title
            cover
          }
        }
        metadata {
          title
          mediaCover
          images
        }
        uri
        designer
      }
    }
  `),
    variables: {
      first,
      skip,
      title,
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
        drop {
          metadata {
            cover
            title
          }
        }
        designer
        metadata {
          title
          mediaCover
          images
        }
        origin
        uri
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
        metadata {
          title
          mediaCover
          images
        }
        designer
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
        metadata {
          title
          mediaCover
          images
        }
        designer
        uri
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
