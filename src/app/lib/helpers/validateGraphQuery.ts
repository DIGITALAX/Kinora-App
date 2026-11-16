import { DocumentNode, gql } from "@apollo/client";
import { MAX_GRAPH_QUERY_LENGTH } from "../constants";

const validateGraphQuery = (query: unknown): DocumentNode | null => {
  if (
    typeof query !== "string" ||
    query.length > MAX_GRAPH_QUERY_LENGTH ||
    /__schema|__type\b/.test(query)
  ) {
    return null;
  }

  const document = gql(query);

  const readOnly = document.definitions.every(
    (definition) =>
      !("operation" in definition) || String(definition.operation) === "query"
  );

  return readOnly ? document : null;
};

export default validateGraphQuery;
