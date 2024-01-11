import { useEffect, useState } from "react";
import {
  LimitType,
  Post,
  Profile,
  PublicationMetadataMainFocusType,
  PublicationType,
  PublicationsQuery,
  SearchPublicationType,
  SearchPublicationsQuery,
  VideoMetadataV3,
} from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import { CHROMADIN_ID } from "../../../../lib/constants";
import { FetchResult } from "@apollo/client";
import searchPubs from "../../../../graphql/lens/queries/searchPubs";
import { StoryboardStage } from "../types/envoke.types";

const useCriteria = (lensConnected: Profile | undefined) => {
  const [videoSearch, setVideoSearch] = useState<string>("");
  const [videoSearchLoading, setVideoSearchLoading] = useState<boolean>(false);
  const [storyboardStage, setStoryboardStage] = useState<StoryboardStage>(
    StoryboardStage.Details
  );
  const [milestoneStoryboardStage, setMilestoneStoryboardStage] =
    useState<number>(0);
  const [videos, setVideos] = useState<Post[]>([]);
  const [chromadinVideos, setChromadinVideos] = useState<Post[]>([]);
  const [videoInfo, setVideoInfo] = useState<{
    hasMoreChromadin: boolean;
    cursorChromadin: string | undefined;
    hasMoreKinora: boolean;
    cursorKinora: string | undefined;
  }>({
    hasMoreChromadin: true,
    cursorChromadin: undefined,
    hasMoreKinora: true,
    cursorKinora: undefined,
  });

  const getVideosSample = async () => {
    setVideoSearchLoading(true);
    try {
      const chromadinData = await getPublications(
        {
          where: {
            from: [CHROMADIN_ID],
            publicationTypes: [PublicationType.Post],
            metadata: {
              mainContentFocus: [PublicationMetadataMainFocusType.Video],
              
            },
          },
          limit: LimitType.Fifty,
        },
        lensConnected?.id
      );

      setChromadinVideos([
        ...(chromadinData?.data?.publications?.items?.filter((item) => item?.momoka == null) || []),
      ] as Post[]);

      setVideoInfo({
        hasMoreChromadin:
          chromadinData?.data?.publications?.items?.length == 50 ? true : false,
        cursorChromadin: chromadinData?.data?.publications?.pageInfo?.next,
        hasMoreKinora: true,
        cursorKinora: undefined,
      });
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoSearchLoading(false);
  };

  const getMoreVideosSample = async () => {
    if (!videoInfo?.hasMoreChromadin && !videoInfo?.hasMoreKinora) return;
    try {
      let kinoraData: FetchResult<PublicationsQuery> | undefined,
        chromadinData: FetchResult<PublicationsQuery> | undefined;

      if (videoInfo?.hasMoreChromadin) {
        chromadinData = await getPublications(
          {
            where: {
              from: [CHROMADIN_ID],
              publicationTypes: [PublicationType.Post],
              metadata: {
                mainContentFocus: [PublicationMetadataMainFocusType.Video],
              },
            },
            limit: LimitType.Ten,
            cursor: videoInfo?.cursorChromadin,
          },
          lensConnected?.id
        );
        setChromadinVideos([
          ...chromadinVideos,
          ...([...(kinoraData?.data?.publications?.items?.filter((item) => item?.momoka == null) || [])] as Post[]),
        ]);
      }

      if (videoInfo?.hasMoreKinora) {
        kinoraData = await getPublications(
          {
            where: {
              publicationTypes: [PublicationType.Post],
              metadata: {
                mainContentFocus: [PublicationMetadataMainFocusType.Video],
                publishedOn: ["kinora"],
              },
            },
            limit: LimitType.Ten,
            cursor: videoInfo?.cursorKinora,
          },
          lensConnected?.id
        );
        setVideos([
          ...videos,
          ...(kinoraData?.data?.publications?.items?.filter((item) => item?.momoka == null) || []),
        ] as Post[]);
      }

      setVideoInfo({
        hasMoreChromadin:
          chromadinData?.data?.publications?.items?.length == 10 ? true : false,
        cursorChromadin: chromadinData?.data?.publications?.pageInfo?.next,
        hasMoreKinora:
          kinoraData?.data?.publications?.items?.length == 10 ? true : false,
        cursorKinora: kinoraData?.data?.publications?.pageInfo?.next,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getVideosSearch = async () => {
    setVideoSearchLoading(true);
    try {
      const kinoraData = await searchPubs(
        {
          query: videoSearch,
          where: {
            publicationTypes: [SearchPublicationType.Post],
            metadata: {
              mainContentFocus: [PublicationMetadataMainFocusType.Video],
              publishedOn: ["kinora"],
            },
          },
        },
        lensConnected?.id
      );

      const chromadinSearch = chromadinVideos?.filter(
        (item: Post) =>
          (item?.metadata as VideoMetadataV3)?.title
            ?.toLowerCase()
            ?.includes(videoSearch?.toLowerCase()) ||
          (item?.metadata as VideoMetadataV3)?.content
            ?.toLowerCase()
            ?.includes(videoSearch?.toLowerCase())
      );

      setVideos([
        ...(kinoraData?.data?.searchPublications?.items?.filter((item) => item?.momoka == null) || []),
        ...chromadinSearch,
      ] as Post[]);

      setVideoInfo((prev) => ({
        ...prev,
        hasMoreKinora:
          kinoraData?.data?.searchPublications?.items?.length == 10
            ? true
            : false,
        cursorKinora: kinoraData?.data?.searchPublications?.pageInfo?.next,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoSearchLoading(false);
  };

  const getMoreVideosSearch = async () => {
    try {
      let kinoraData: FetchResult<SearchPublicationsQuery> | undefined;
      if (videoInfo?.hasMoreKinora) {
        kinoraData = await searchPubs(
          {
            query: videoSearch,
            where: {
              publicationTypes: [SearchPublicationType.Post],
              metadata: {
                mainContentFocus: [PublicationMetadataMainFocusType.Video],
                publishedOn: ["kinora"],
              },
            },
            cursor: videoInfo?.cursorKinora,
          },
          lensConnected?.id
        );
      }

      setVideos([
        ...videos,
        ...(kinoraData?.data?.searchPublications?.items?.filter((item) => item?.momoka == null) || []),
      ] as Post[]);

      setVideoInfo((prev) => ({
        ...prev,
        hasMoreKinora:
          kinoraData?.data?.searchPublications?.items?.length == 10
            ? true
            : false,
        cursorKinora: kinoraData?.data?.searchPublications?.pageInfo?.next,
      }));
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (chromadinVideos?.length < 1) {
      getVideosSample();
    }
  }, []);

  return {
    videoSearchLoading,
    videoSearch,
    setVideoSearch,
    getVideosSearch,
    getMoreVideosSearch,
    videoInfo,
    videos,
    getMoreVideosSample,
    chromadinVideos,
    storyboardStage,
    setStoryboardStage,
    milestoneStoryboardStage,
    setMilestoneStoryboardStage,
  };
};

export default useCriteria;
