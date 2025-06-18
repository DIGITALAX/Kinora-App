import { ModalContext } from "@/app/providers";
import { Account, PageSize } from "@lens-protocol/client";
import { useContext, useState } from "react";
import { Quest } from "../types/common.types";
import { fetchAccounts } from "@lens-protocol/client/actions";
import { getQuestSearch } from "../../../../../graphql/getQuestSearch";
import buildTextQuery from "@/app/lib/helpers/buildTextQuery";

const useSearch = () => {
  const context = useContext(ModalContext);
  const [searchResults, setSearchResults] = useState<(Account | Quest)[]>([]);
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
    if (searchTarget?.trim() == "" || !searchTarget || !context?.clienteLens)
      return;

    setSearchLoading(true);
    try {
      let profiles: Account[] = [],
        cursor: string | undefined;
      const profileSearch = await fetchAccounts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          pageSize: PageSize.Ten,
          filter: {
            searchBy: {
              localNameQuery: searchTarget,
            },
          },
        }
      );

      if (profileSearch?.isOk()) {
        profiles = profileSearch?.value?.items as Account[];
        cursor = profileSearch?.value?.pageInfo?.next as string;
      }

      const textWhere = buildTextQuery(searchTarget?.replaceAll("@", "")!);
      const questSearch = await getQuestSearch(textWhere!, 10, 0);
      setSearchInfo({
        hasMoreProfiles: profiles?.length !== 10 ? false : true,
        hasMoreQuests:
          questSearch?.data?.questInstantiateds?.length !== 10 ? false : true,
        cursorProfiles: profiles?.length !== 10 ? undefined : cursor,
        cursorQuests:
          questSearch?.data?.questInstantiateds?.length !== 10 ? 0 : 10,
      });
      setSearchOpen(true);
      setSearchResults(
        [
          ...(profiles || []),
          ...(questSearch?.data?.questInstantiateds || []),
        ].sort(() => 0.5 - Math.random()) as (Quest | Account)[]
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setSearchLoading(false);
  };

  const handleMoreSearchQuests = async () => {
    if (!searchInfo.hasMoreProfiles && !searchInfo.hasMoreQuests) return;
    try {
      let profileSearch: Account[] = [],
        questSearch: Quest[] = [],
        cursor: string | undefined;
      if (searchInfo.hasMoreProfiles) {
        const data = await fetchAccounts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            pageSize: PageSize.Ten,
            cursor: searchInfo?.cursorProfiles,
            filter: {
              searchBy: {
                localNameQuery: searchTarget,
              },
            },
          }
        );

        if (data?.isOk()) {
          profileSearch = data?.value?.items as Account[];
          cursor = data?.value?.pageInfo?.next as string;
        }
      }

      if (searchInfo?.hasMoreQuests) {
        const textWhere = buildTextQuery(searchTarget?.replaceAll("@", "")!);
        const data = await getQuestSearch(textWhere!, 10, 0);

        questSearch = data?.data?.questInstantiateds;
      }

      setSearchInfo({
        hasMoreProfiles: profileSearch?.length !== 10 ? false : true,
        hasMoreQuests: questSearch?.length !== 10 ? false : true,
        cursorProfiles: profileSearch?.length !== 10 ? undefined : cursor,
        cursorQuests:
          questSearch?.length !== 10 ? 0 : searchInfo?.cursorQuests + 10,
      });

      setSearchResults([
        ...searchResults,
        ...([...(profileSearch || []), ...(questSearch || [])].sort(
          () => 0.5 - Math.random()
        ) as (Quest | Account)[]),
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
