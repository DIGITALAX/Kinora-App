import { Collection } from "@/components/Envoke/types/envoke.types";
import { Profile } from "../../graphql/generated";
import getPublication from "../../graphql/lens/queries/publication";
import toHexWithLeadingZero from "./toHexWithLeadingZero";
import collectionFixer from "./collectionFixer";

const handleCollectionProfilesAndPublications = async (
  collections: Collection[],
  lens: Profile | undefined
): Promise<Collection[] | undefined> => {
  try {
    const promises = [...(collections || [])]?.map(
      async (collection: Collection) => {
        if (collection?.profileId && collection?.pubId) {
          const publication = await getPublication(
            {
              forId: `${toHexWithLeadingZero(
                Number(collection?.profileId)
              )}-${toHexWithLeadingZero(Number(collection?.pubId))}`,
            },
            lens?.id
          );

          const coll = await collectionFixer(collection);
          return {
            ...coll,
            profile: publication?.data?.publication?.by as Profile,
            publication: publication?.data?.publication,
          } as Collection;
        }
      }
    );
    const colls = await Promise.all(promises);
    return colls?.filter(Boolean) as Collection[];
  } catch (err: any) {
    console.error(err.message);
  }
};

export default handleCollectionProfilesAndPublications;
