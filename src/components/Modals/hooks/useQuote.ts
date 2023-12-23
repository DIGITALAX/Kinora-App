import { MakePostComment } from "@/components/Quest/types/quest.types";
import { useState } from "react";
import { Profile } from "../../../../graphql/generated";
import {
  PostCollectGifState,
  setPostCollectGif,
} from "../../../../redux/reducers/postCollectGifSlice";
import lensPost from "../../../../lib/helpers/lensPost";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { Dispatch } from "redux";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import { QuoteState, setQuote } from "../../../../redux/reducers/quoteSlice";
import lensQuote from "../../../../lib/helpers/lensQuote";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";

const useQuote = (
  postCollectGif: PostCollectGifState,
  publicClient: PublicClient,
  address: `0x${string}` | undefined,
  dispatch: Dispatch,
  quoteBox: QuoteState
) => {
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [profilesOpen, setProfilesOpen] = useState<boolean[]>([false]);
  const [caretCoord, setCaretCoord] = useState<{
    x: number;
    y: number;
  }>({
    x: 0,
    y: 0,
  });
  const [quoteLoading, setQuoteLoading] = useState<boolean[]>([false]);
  const [makeQuote, setMakeQuote] = useState<MakePostComment[]>([
    {
      content: "",
      images: [],
      videos: [],
    },
  ]);
  const [contentLoading, setContentLoading] = useState<
    {
      image: boolean;
      video: boolean;
    }[]
  >([
    {
      image: false,
      video: false,
    },
  ]);

  const handleQuote = async () => {
    if (
      !makeQuote[0]?.content &&
      !makeQuote[0]?.images &&
      !makeQuote[0]?.videos &&
      postCollectGif?.gifs?.[quoteBox?.publication?.id]
    )
      return;
    setQuoteLoading([true]);

    try {
      const contentURI = await uploadPostContent(
        makeQuote[0]?.content?.trim() == "" ? " " : makeQuote[0]?.content,
        makeQuote[0]?.images || [],
        makeQuote[0]?.videos || [],
        [],
        postCollectGif.gifs?.[quoteBox?.publication?.id] || []
      );

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      if (quoteBox?.publication) {
        await lensQuote(
          quoteBox?.publication?.id,
          contentURI?.string!,
          dispatch,
          postCollectGif.collectTypes?.[quoteBox?.publication?.id]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollectGif.collectTypes?.[quoteBox?.publication?.id]!,
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearBox()
        );
      } else {
        await lensPost(
          contentURI?.string!,
          dispatch,
          postCollectGif.collectTypes?.[quoteBox?.publication?.id]
            ? [
                {
                  collectOpenAction: {
                    simpleCollectOpenAction:
                      postCollectGif.collectTypes?.[quoteBox?.publication?.id]!,
                  },
                },
              ]
            : undefined,
          address as `0x${string}`,
          clientWallet,
          publicClient,
          () => clearBox()
        );
      }

      const gifs = { ...postCollectGif.gifs };
      delete gifs[quoteBox?.publication?.id];
      const cts = { ...postCollectGif.collectTypes };
      delete cts[quoteBox?.publication?.id];
      dispatch(
        setPostCollectGif({
          actionCollectType: cts,
          actionGifs: gifs,
        })
      );
    } catch (err: any) {
      if (err?.message?.includes("User rejected the request")) return;
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        dispatch(setInteractError(true));
        console.error(err.message);
      } else {
        dispatch(
          setIndexer({
            actionOpen: true,
            actionMessage: "Successfully Indexed",
          })
        );

        setTimeout(() => {
          dispatch(
            setIndexer({
              actionOpen: false,
              actionMessage: undefined,
            })
          );
        }, 3000);
      }
    }

    setQuoteLoading([false]);
  };

  const clearBox = () => {
    setMakeQuote([
      {
        content: "",
        images: [],
        videos: [],
      },
    ]);
    dispatch(
      setQuote({
        actionOpen: false,
      })
    );
    setQuoteLoading([false]);
  };

  return {
    setMakeQuote,
    setCaretCoord,
    setMentionProfiles,
    setProfilesOpen,
    profilesOpen,
    mentionProfiles,
    caretCoord,
    makeQuote,
    quoteLoading,
    setContentLoading,
    contentLoading,
    handleQuote,
  };
};

export default useQuote;
