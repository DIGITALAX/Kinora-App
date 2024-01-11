import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const httpLinkPrint = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/print-library",
}); 
export const graphPrintClient = new ApolloClient({
  link: httpLinkPrint,
  cache: new InMemoryCache(),
});

const httpLinkQuest = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/digitalax/kinora-mumbai",
});

export const graphKinoraClient = new ApolloClient({
  link: httpLinkQuest,
  cache: new InMemoryCache(),
});
