import { useState } from "react";
import {
  LimitType,
  Post,
  Profile,
  PublicationMetadataMainFocusType,
  SearchProfilesQuery,
  SearchPublicationType,
  SearchPublicationsQuery,
} from "../../../../graphql/generated";
import searchProfiles from "../../../../graphql/lens/queries/searchProfiles";
import searchPubs from "../../../../graphql/lens/queries/searchPubs";

const useSearch = (lensConnected: Profile | undefined) => {
  const [searchResults, setSearchResults] = useState<(Profile | Post)[]>([]);
  const [searchTarget, setSearchTarget] = useState<string>("");
  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);
  const [searchInfo, setSearchInfo] = useState<{
    hasMoreProfiles: boolean;
    hasMorePubs: boolean;
    cursorProfiles: string | undefined;
    cursorPubs: string | undefined;
  }>({
    hasMoreProfiles: true,
    hasMorePubs: true,
    cursorProfiles: undefined,
    cursorPubs: undefined,
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

      const pubSearch = await searchPubs(
        {
          limit: LimitType.Ten,
          query: searchTarget,
          where: {
            publicationTypes: [SearchPublicationType.Post],
            metadata: {
              publishedOn: ["kinora"],
              mainContentFocus: [PublicationMetadataMainFocusType.Video],
            },
          },
        },
        lensConnected?.id
      );

      setSearchInfo({
        hasMoreProfiles:
          profileSearch?.data?.searchProfiles?.items?.length !== 10
            ? false
            : true,
        hasMorePubs:
          pubSearch?.data?.searchPublications?.items?.length !== 10
            ? false
            : true,
        cursorProfiles:
          profileSearch?.data?.searchProfiles?.items?.length !== 10
            ? undefined
            : profileSearch?.data?.searchProfiles?.pageInfo?.next,
        cursorPubs:
          pubSearch?.data?.searchPublications?.items?.length !== 10
            ? undefined
            : pubSearch?.data?.searchPublications?.pageInfo?.next,
      });
      setSearchOpen(true);
      setSearchResults(
        [
          ...(profileSearch?.data?.searchProfiles?.items || []),
          ...(pubSearch?.data?.searchPublications?.items || []),
        ].sort(() => 0.5 - Math.random()) as (Post | Profile)[]
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleMoreSearchQuests = async () => {
    if (!searchInfo.hasMoreProfiles && !searchInfo.hasMorePubs) return;
    try {
      let profileSearch: SearchProfilesQuery | undefined | null,
        pubSearch: SearchPublicationsQuery | undefined | null;
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

      if (searchInfo?.hasMorePubs) {
        const { data } = await searchPubs(
          {
            limit: LimitType.Ten,
            query: searchTarget,
            where: {
              publicationTypes: [SearchPublicationType.Post],
              metadata: {
                publishedOn: ["kinora"],
                mainContentFocus: [PublicationMetadataMainFocusType.Video],
              },
            },
            cursor: searchInfo?.cursorPubs,
          },
          lensConnected?.id
        );
        pubSearch = data;
      }

      setSearchInfo({
        hasMoreProfiles:
          profileSearch?.searchProfiles?.items?.length !== 10 ? false : true,
        hasMorePubs:
          pubSearch?.searchPublications?.items?.length !== 10 ? false : true,
        cursorProfiles:
          profileSearch?.searchProfiles?.items?.length !== 10
            ? undefined
            : profileSearch?.searchProfiles?.pageInfo?.next,
        cursorPubs:
          pubSearch?.searchPublications?.items?.length !== 10
            ? undefined
            : pubSearch?.searchPublications?.pageInfo?.next,
      });

      setSearchResults([
        ...searchResults,
        ...([
          ...(profileSearch?.searchProfiles?.items || []),
          ...(pubSearch?.searchPublications?.items || []),
        ].sort(() => 0.5 - Math.random()) as (Post | Profile)[]),
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
