import { useContext, useEffect, useState } from "react";
import { ModalContext } from "@/app/providers";
import { StoryboardStage } from "../types/envoke.types";
import {
  AnyPost,
  MainContentFocus,
  PageSize,
  Paginated,
  Post,
  PostType,
  VideoMetadata,
} from "@lens-protocol/client";
import { fetchPosts } from "@lens-protocol/client/actions";
import { CHROMADIN } from "@/app/lib/constants";

const useCriteria = () => {
  const context = useContext(ModalContext);
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
      const res = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          filter: {
            authors: [CHROMADIN],
            postTypes: [PostType.Root],
          },
          pageSize: PageSize.Fifty,
        }
      );

      if (res?.isOk()) {
        setChromadinVideos(res?.value?.items as Post[]);

        setVideoInfo({
          hasMoreChromadin: res?.value?.items?.length == 50 ? true : false,
          cursorChromadin: res?.value?.pageInfo?.next!,
          hasMoreKinora: true,
          cursorKinora: undefined,
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoSearchLoading(false);
  };

  const getMoreVideosSample = async () => {
    if (!videoInfo?.hasMoreChromadin && !videoInfo?.hasMoreKinora) return;
    try {
      let kinoraData: Paginated<AnyPost> | undefined,
        chromadinData: Paginated<AnyPost> | undefined;

      if (videoInfo?.hasMoreChromadin) {
        const res = await fetchPosts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            cursor: videoInfo?.cursorChromadin,
            filter: {
              authors: [CHROMADIN],
              postTypes: [PostType.Root],
            },
            pageSize: PageSize.Fifty,
          }
        );

        if (res?.isOk()) {
          chromadinData = res?.value;
          setChromadinVideos([
            ...chromadinVideos,
            ...(res?.value?.items as Post[]),
          ]);
        }
      }

      if (videoInfo?.hasMoreKinora) {
        const res = await fetchPosts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            filter: {
              postTypes: [PostType.Root],
              metadata: {
                mainContentFocus: [MainContentFocus.Video],
                tags: {
                  oneOf: ["kinora"],
                },
              },
            },
            pageSize: PageSize.Ten,
            cursor: videoInfo?.cursorKinora,
          }
        );

        if (res?.isOk()) {
          kinoraData = res?.value;
          setVideos([...videos, ...(res?.value?.items || [])] as Post[]);
        }
      }

      setVideoInfo({
        hasMoreChromadin: chromadinData?.items?.length == 10 ? true : false,
        cursorChromadin: chromadinData?.pageInfo?.next!,
        hasMoreKinora: kinoraData?.items?.length == 10 ? true : false,
        cursorKinora: kinoraData?.pageInfo?.next!,
      });
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getVideosSearch = async () => {
    setVideoSearchLoading(true);
    try {
      const kinoraData = await fetchPosts(
        context?.lensConectado?.sessionClient ?? context?.clienteLens!,
        {
          filter: {
            searchQuery: videoSearch,
            postTypes: [PostType.Root],
            metadata: {
              mainContentFocus: [MainContentFocus.Video],
              tags: {
                oneOf: ["kinora"],
              },
            },
          },
        }
      );

      const chromadinSearch = chromadinVideos?.filter(
        (item: Post) =>
          (item?.metadata as VideoMetadata)?.title
            ?.toLowerCase()
            ?.includes(videoSearch?.toLowerCase()) ||
          (item?.metadata as VideoMetadata)?.content
            ?.toLowerCase()
            ?.includes(videoSearch?.toLowerCase())
      );

      if (kinoraData.isOk()) {
        setVideos([...kinoraData?.value?.items, ...chromadinSearch] as Post[]);

        setVideoInfo((prev) => ({
          ...prev,
          hasMoreKinora: kinoraData?.value?.items?.length == 10 ? true : false,
          cursorKinora: kinoraData?.value?.pageInfo?.next!,
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoSearchLoading(false);
  };

  const getMoreVideosSearch = async () => {
    try {
      if (videoInfo?.hasMoreKinora) {
        const res = await fetchPosts(
          context?.lensConectado?.sessionClient ?? context?.clienteLens!,
          {
            cursor: videoInfo?.cursorKinora,
            filter: {
              searchQuery: videoSearch,
              postTypes: [PostType.Root],
              metadata: {
                mainContentFocus: [MainContentFocus.Video],
                tags: {
                  oneOf: ["kinora"],
                },
              },
            },
          }
        );

        if (res?.isOk()) {
          setVideos([...videos, ...res?.value?.items] as Post[]);

          setVideoInfo((prev) => ({
            ...prev,
            hasMoreKinora: res?.value?.items?.length == 10 ? true : false,
            cursorKinora: res?.value?.pageInfo?.next!,
          }));
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (chromadinVideos?.length < 1 && context?.clienteLens) {
      getVideosSample();
    }
  }, [context?.clienteLens]);

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
