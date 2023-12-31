import { useEffect, useState } from "react";
import whoReactedPublication from "../../../../graphql/lens/queries/whoReacted";
import { LimitType, Profile, Quote } from "../../../../graphql/generated";
import getPublications from "../../../../graphql/lens/queries/publications";
import { SocialType, Video, VideoActivity } from "../types/quest.types";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import whoActedPublication from "../../../../graphql/lens/queries/whoActed";

const useWho = (
  lensConnected: Profile | undefined,
  questId: string,
  socialType: SocialType,
  videoPlaying: Video | VideoActivity | undefined
) => {
  const [dataLoading, setDataLoading] = useState<boolean>(false);
  const [reactors, setReactors] = useState<any[]>([]);
  const [quoters, setQuoters] = useState<Quote[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreQuote, setHasMoreQuote] = useState<boolean>(true);
  const [pageInfo, setPageInfo] = useState<string>();
  const [pageInfoQuote, setPageInfoQuote] = useState<string>();
  const [quoteMirrorSwitch, setQuoteMirrorSwitch] = useState<boolean>(false);

  const showLikes = async () => {
    if (!videoPlaying && !questId) return;
    setDataLoading(true);
    try {
      const data = await whoReactedPublication(
        {
          for: videoPlaying
            ? `${toHexWithLeadingZero(
                Number(videoPlaying?.profileId)
              )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
            : questId,
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      setReactors(data?.data?.whoReactedPublication?.items || []);
      setPageInfo(data?.data?.whoReactedPublication.pageInfo.next);

      if (
        !data?.data?.whoReactedPublication?.items ||
        data?.data?.whoReactedPublication?.items?.length < 10
      ) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.data?.whoReactedPublication?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMirrorQuotes = async () => {
    if (!videoPlaying && !questId) return;

    setDataLoading(true);

    try {
      const mirrorData = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            mirrorOn: videoPlaying
              ? `${toHexWithLeadingZero(
                  Number(videoPlaying?.profileId)
                )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
              : questId,
          },
        },
        lensConnected?.id
      );

      setReactors(mirrorData?.data?.publications?.items || []);
      setPageInfo(mirrorData?.data?.publications.pageInfo.next);
      if (
        !mirrorData?.data?.publications?.items ||
        mirrorData?.data?.publications?.items?.length < 10
      ) {
        setHasMore(false);
      } else if (mirrorData?.data?.publications?.items?.length === 10) {
        setHasMore(true);
      }

      const quoteData = await getPublications(
        {
          limit: LimitType.Ten,
          where: {
            quoteOn: videoPlaying
              ? `${toHexWithLeadingZero(
                  Number(videoPlaying?.profileId)
                )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
              : questId,
          },
        },
        lensConnected?.id
      );

      setQuoters((quoteData?.data?.publications?.items || []) as Quote[]);
      setPageInfoQuote(quoteData?.data?.publications.pageInfo.next);

      if (
        !quoteData?.data?.publications?.items ||
        quoteData?.data?.publications?.items?.length < 10
      ) {
        setHasMoreQuote(false);
        setDataLoading(false);
      } else if (quoteData?.data?.publications?.items?.length === 10) {
        setHasMoreQuote(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreLikes = async () => {
    if (!pageInfo || !hasMore) return;
    try {
      const data = await whoReactedPublication(
        {
          for: videoPlaying
            ? `${toHexWithLeadingZero(
                Number(videoPlaying?.profileId)
              )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
            : questId,
          limit: LimitType.Ten,
          cursor: pageInfo,
        },
        lensConnected?.id
      );

      setReactors([
        ...reactors,
        ...(data?.data?.whoReactedPublication?.items || []),
      ]);
      setPageInfo(data?.data?.whoReactedPublication.pageInfo.next);

      if (
        !data?.data?.whoReactedPublication?.items ||
        data?.data?.whoReactedPublication?.items?.length < 10
      ) {
        setHasMore(false);
        return;
      } else if (data?.data?.whoReactedPublication?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMoreQuoteMirrors = async () => {
    if ((!pageInfo || !hasMore) && (!pageInfoQuote || !hasMoreQuote)) return;

    try {
      if (hasMore && pageInfo) {
        const mirrorData = await getPublications(
          {
            limit: LimitType.Ten,
            where: {
              mirrorOn: videoPlaying
                ? `${toHexWithLeadingZero(
                    Number(videoPlaying?.profileId)
                  )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
                : questId,
            },
            cursor: pageInfo,
          },
          lensConnected?.id
        );
        setReactors([
          ...reactors,
          ...(mirrorData?.data?.publications?.items || []),
        ]);
        setPageInfo(mirrorData?.data?.publications.pageInfo.next);

        if (
          !mirrorData?.data?.publications?.items ||
          mirrorData?.data?.publications?.items?.length < 10
        ) {
          setHasMore(false);
          return;
        } else if (mirrorData?.data?.publications?.items?.length === 10) {
          setHasMore(true);
        }
      }

      if (pageInfoQuote && hasMoreQuote) {
        const quoteData = await getPublications(
          {
            limit: LimitType.Ten,
            where: {
              mirrorOn: videoPlaying
                ? `${toHexWithLeadingZero(
                    Number(videoPlaying?.profileId)
                  )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
                : questId,
            },
            cursor: pageInfoQuote,
          },
          lensConnected?.id
        );

        setQuoters([
          ...quoters,
          ...(quoteData?.data?.publications?.items || []),
        ] as Quote[]);
        setPageInfoQuote(quoteData?.data?.publications.pageInfo.next);

        if (
          !quoteData?.data?.publications?.items ||
          quoteData?.data?.publications?.items?.length < 10
        ) {
          setHasMoreQuote(false);
          return;
        } else if (quoteData?.data?.publications?.items?.length === 10) {
          setHasMoreQuote(true);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showComments = async () => {
    setDataLoading(true);
    try {
      const data = await getPublications(
        {
          where: {
            commentOn: {
              id: videoPlaying
                ? `${toHexWithLeadingZero(
                    Number(videoPlaying?.profileId)
                  )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
                : questId,
              // ranking: {
              //   filter: CommentRankingFilterType.Relevant,
              // },
            },
          },
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      setReactors(data?.data?.publications?.items || []);
      setPageInfo(data?.data?.publications.pageInfo.next);

      if (
        !data?.data?.publications?.items ||
        data?.data?.publications?.items?.length < 10
      ) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.data?.publications?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreComments = async () => {
    if (!pageInfo || !hasMore) return;

    try {
      const data = await getPublications(
        {
          where: {
            commentOn: {
              id: videoPlaying
                ? `${toHexWithLeadingZero(
                    Number(videoPlaying?.profileId)
                  )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
                : questId,
              // ranking: {
              //   filter: CommentRankingFilterType.Relevant,
              // },
            },
          },
          limit: LimitType.Ten,
          cursor: pageInfo,
        },
        lensConnected?.id
      );
      setReactors([...reactors, ...(data?.data?.publications?.items || [])]);
      setPageInfo(data?.data?.publications.pageInfo.next);

      if (
        !data?.data?.publications?.items ||
        data?.data?.publications?.items?.length < 10
      ) {
        setHasMore(false);
        return;
      } else if (data?.data?.publications?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showCollects = async () => {
    setDataLoading(true);
    try {
      const data = await whoActedPublication(
        {
          on: videoPlaying
            ? `${toHexWithLeadingZero(
                Number(videoPlaying?.profileId)
              )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
            : questId,
          limit: LimitType.Ten,
        },
        lensConnected?.id
      );

      setReactors(data?.data?.whoActedOnPublication?.items || []);
      setPageInfo(data?.data?.whoActedOnPublication.pageInfo.next);

      if (
        !data?.data?.whoActedOnPublication?.items ||
        data?.data?.whoActedOnPublication?.items?.length < 10
      ) {
        setHasMore(false);
        setDataLoading(false);
        return;
      } else if (data?.data?.whoActedOnPublication?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setDataLoading(false);
  };

  const showMoreCollects = async () => {
    if (!pageInfo || !hasMore) return;

    try {
      const data = await whoActedPublication(
        {
          on: videoPlaying
            ? `${toHexWithLeadingZero(
                Number(videoPlaying?.profileId)
              )}-${toHexWithLeadingZero(Number(videoPlaying?.pubId))}`
            : questId,
          limit: LimitType.Ten,
          cursor: pageInfo,
        },
        lensConnected?.id
      );
      setReactors([
        ...reactors,
        ...(data?.data?.whoActedOnPublication?.items || []),
      ]);
      setPageInfo(data?.data?.whoActedOnPublication.pageInfo.next);

      if (
        !data?.data?.whoActedOnPublication?.items ||
        data?.data?.whoActedOnPublication?.items?.length < 10
      ) {
        setHasMore(false);
        return;
      } else if (data?.data?.whoActedOnPublication?.items?.length === 10) {
        setHasMore(true);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const showMore = () => {
    switch (socialType) {
      case SocialType.Reacts:
        showMoreLikes();
        break;

      case SocialType.Comments:
        showMoreComments();
        break;

      case SocialType.Mirrors:
        showMoreQuoteMirrors();
        break;

      case SocialType.Players:
        showMoreCollects();
        break;
    }
  };

  useEffect(() => {
    switch (socialType) {
      case SocialType.Reacts:
        showLikes();
        break;

      case SocialType.Mirrors:
        showMirrorQuotes();
        break;

      case SocialType.Comments:
        showComments();
        break;

      case SocialType.Players:
        if (videoPlaying) {
          showCollects();
        }

        break;
    }
  }, [socialType, videoPlaying]);

  return {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    showComments,
    quoteMirrorSwitch,
    setQuoteMirrorSwitch,
    setReactors,
    setQuoters,
  };
};

export default useWho;
