import { useState } from "react";
import {
  LimitType,
  Profile,
  SearchProfilesQuery,
} from "../../../../graphql/generated";
import searchProfiles from "../../../../graphql/lens/queries/searchProfiles";
import { getQuestSearch } from "../../../../graphql/subgraph/getQuestSearch";
import { Quest } from "@/components/Quest/types/quest.types";
import buildTextQuery from "../../../../lib/helpers/buildTextQuery";

const useSearch = (lensConnected: Profile | undefined) => {
  const [searchResults, setSearchResults] = useState<(Profile | Quest)[]>([]);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchInfo, setSearchInfo] = useState<{
    hasMoreProfiles: boolean;
    hasMoreQuests: boolean;
    cursorProfiles: string | undefined;
    cursorQuests: number;
  }>({
    hasMoreProfiles: true,
    hasMoreQuests: true,
    cursorProfiles: undefined,
    cursorQuests: 0,
  });

  const handleSearchQuests = async () => {
    if (searchTarget?.trim() == "" || !searchTarget) return;

    setSearchLoading(true);
    try {
      const profileSearch = await searchProfiles(
        {
          query: searchTarget,
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      const textWhere = buildTextQuery(searchTarget?.replaceAll("@", "")!);
      const questSearch = await getQuestSearch(textWhere!, 10, 0);
      setSearchInfo({
        hasMoreProfiles:
          profileSearch?.data?.searchProfiles?.items?.length !== 10
            ? false
            : true,
        hasMoreQuests:
          questSearch?.data?.questInstantiateds?.length !== 10 ? false : true,
        cursorProfiles:
          profileSearch?.data?.searchProfiles?.items?.length !== 10
            ? undefined
            : profileSearch?.data?.searchProfiles?.pageInfo?.next,
        cursorQuests:
          questSearch?.data?.questInstantiateds?.length !== 10 ? 0 : 10,
      });
      setSearchOpen(true);
      setSearchResults(
        [
          ...(profileSearch?.data?.searchProfiles?.items || []),
          ...(questSearch?.data?.questInstantiateds || []),
        ].sort(() => 0.5 - Math.random()) as (Quest | Profile)[]
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleMoreSearchQuests = async () => {
    if (!searchInfo.hasMoreProfiles && !searchInfo.hasMoreQuests) return;
    try {
      let profileSearch: SearchProfilesQuery | undefined | null,
        questSearch: Quest[] | undefined | null;
      if (searchInfo.hasMoreProfiles) {
        const { data } = await searchProfiles(
          {
            query: searchTarget,
            limit: LimitType.Ten,
            cursor: searchInfo?.cursorProfiles,
          },
          lensConnected?.id
        );
        profileSearch = data;
      }

      if (searchInfo?.hasMoreQuests) {
        const textWhere = buildTextQuery(searchTarget?.replaceAll("@", "")!);
        const data = await getQuestSearch(textWhere!, 10, 0);

        questSearch = data?.data?.questInstantiateds;
      }

      setSearchInfo({
        hasMoreProfiles:
          profileSearch?.searchProfiles?.items?.length !== 10 ? false : true,
        hasMoreQuests: questSearch?.length !== 10 ? false : true,
        cursorProfiles:
          profileSearch?.searchProfiles?.items?.length !== 10
            ? undefined
            : profileSearch?.searchProfiles?.pageInfo?.next,
        cursorQuests:
          questSearch?.length !== 10 ? 0 : searchInfo?.cursorQuests + 10,
      });

      setSearchResults([
        ...searchResults,
        ...([
          ...(profileSearch?.searchProfiles?.items || []),
          ...(questSearch || []),
        ].sort(() => 0.5 - Math.random()) as (Quest | Profile)[]),
      ]);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    searchLoading,
    handleMoreSearchQuests,
    searchInfo,
    searchTarget,
    setSearchTarget,
    searchResults,
    handleSearchQuests,
    setSearchOpen,
    searchOpen,
  };
};

export default useSearch;
