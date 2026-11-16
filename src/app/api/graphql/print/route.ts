import { NextRequest, NextResponse } from "next/server";
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";
import guardApiRequest from "@/app/lib/helpers/guardApiRequest";
import validateGraphQuery from "@/app/lib/helpers/validateGraphQuery";

const serverPrintClient = new ApolloClient({
  link: new HttpLink({
    uri: process.env.GRAPH_NODE_URL_PRINT,
  }),
  cache: new InMemoryCache(),
});

export async function POST(request: NextRequest) {
  try {
    const blocked = guardApiRequest(request, "graphql-print");
    if (blocked) return blocked;

    const { query, variables } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query is required" },
        { status: 400 }
      );
    }

    const document = validateGraphQuery(query);

    if (!document) {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    const result = await serverPrintClient.query({
      query: document,
      variables: variables || {},
      fetchPolicy: "no-cache",
      errorPolicy: "all",
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "GraphQL query failed" },
      { status: 500 }
    );
  }
}
