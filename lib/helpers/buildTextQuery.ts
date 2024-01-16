import { KINORA_QUEST_DATA } from "../constants";

const buildTextQuery = (inputText: string): Object | void => {
  const trimmedInputText = inputText?.trim();
  if (trimmedInputText === "" || !trimmedInputText) return;

  const commonWords = new Set([
    "a",
    "and",
    "or",
    "the",
    "in",
    "on",
    "for",
    "with",
  ]);
  const fieldsToSearch = ["title", "description"];

  const searchWords = trimmedInputText
    ?.split(/\s+/)
    ?.map((word) => word?.trim())
    ?.filter(
      (word) =>
        word && (word.length > 1 || trimmedInputText?.split(/\s+/).length === 1)
    )
    ?.filter((word) => !commonWords.has(word.toLowerCase()));

  let orConditions: any[] = [];
  fieldsToSearch?.forEach((field) => {
    searchWords?.forEach((word) => {
      orConditions.push({ [`${field}_contains_nocase`]: word });
    });
  });

  const query = {
    and: [
      {
        questMetadata_: { or: orConditions },
      },

      {
        contractAddress: KINORA_QUEST_DATA,
      },
    ],
  };

  return query;
};

export default buildTextQuery;

export const combineQueryObjects = (obj1: any, obj2: any) => {
  const obj1QuestMetadataOrConditions = obj1.or[0].questMetadata_.or;

  if (obj2.and[0].hasOwnProperty("questMetadata_")) {
    obj2.and[0].questMetadata_.or = [
      ...obj2.and[0].questMetadata_.or,
      ...obj1QuestMetadataOrConditions,
    ];
  } else {
    obj2.and.unshift({
      questMetadata_: { or: obj1QuestMetadataOrConditions },
    });
  }

  return obj2;
};
