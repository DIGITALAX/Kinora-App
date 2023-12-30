import { useEffect, useState } from "react";
import { useCreateAsset } from "@livepeer/react";
import {
  Erc20,
  LimitType,
  SimpleCollectOpenActionModuleInput,
} from "../../../../graphql/generated";
import getEnabledCurrencies from "../../../../graphql/lens/queries/enabledCurrencies";
import { setAvailableCurrencies } from "../../../../redux/reducers/availableCurrenciesSlice";
import { Dispatch } from "redux";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { setIndexer } from "../../../../redux/reducers/indexerSlice";
import lensPost from "../../../../lib/helpers/lensPost";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import uploadPostContent from "../../../../lib/helpers/uploadPostContent";
import convertToFile from "../../../../lib/helpers/convertToFile";

const useUpload = (
  address: `0x${string}` | undefined,
  dispatch: Dispatch,
  availableCurrencies: Erc20[],
  publicClient: PublicClient
) => {
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [postDetails, setPostDetails] = useState<{
    title: string;
    description: string;
    video: string;
    tags: string;
    collectDetails: SimpleCollectOpenActionModuleInput;
  }>({
    title: "",
    description: "",
    video: "",
    tags: "",
    collectDetails: {
      amount: {
        currency: "",
        value: "",
      },
      collectLimit: undefined,
      endsAt: undefined,
      followerOnly: false,
      recipient: address,
      referralFee: 0,
    },
  });
  const [openMeasure, setOpenMeasure] = useState<{
    collectibleOpen: boolean;
    collectible: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  }>({
    collectibleOpen: false,
    collectible: "Yes",
    award: "No",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: "",
    timeOpen: false,
    time: "",
  });

  const getVideoCover = (): string => {
    const video = document.createElement("video");
    video.src = postDetails?.video;
    video.currentTime = 0.1;
    let canvasCover: string = "";

    video.addEventListener("loadeddata", () => {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      canvasCover = canvas.toDataURL();
    });

    video.load();

    return canvasCover;
  };

  const handleVideoPost = async () => {
    if (!postDetails?.description || !postDetails?.title || !postDetails?.video)
      return;
    setUploadLoading(true);
    try {
      const { mutateAsync: createAsset } = useCreateAsset({
        sources: [
          {
            name: postDetails.title,
            file: convertToFile(postDetails?.video, "video/mp4") as File,
          },
        ],
      });

      await createAsset?.();

      const contentURI = await uploadPostContent(
        postDetails.description?.trim() == "" ? " " : postDetails.description,
        [],
        [postDetails?.video],
        [],
        [],
        postDetails.title,
        postDetails?.tags
          ?.split(",")
          .map((tag) => tag?.trim())
          .filter((tag) => tag.length > 0),
        false,
        getVideoCover()
      );

      const clientWallet = createWalletClient({
        chain: polygonMumbai,
        transport: custom((window as any).ethereum),
      });

      await lensPost(
        contentURI?.string!,
        dispatch,
        [
          {
            collectOpenAction: {
              simpleCollectOpenAction: postDetails?.collectDetails,
            },
          },
        ],
        address as `0x${string}`,
        clientWallet,
        publicClient
      );

      setPostDetails({
        title: "",
        description: "",
        video: "",
        tags: "",
        collectDetails: {
          amount: {
            currency: "",
            value: "",
          },
          collectLimit: undefined,
          endsAt: undefined,
          followerOnly: false,
          recipient: address,
          referralFee: 0,
        },
      });
      setOpenMeasure({
        collectibleOpen: false,
        collectible: "Yes",
        award: "No",
        whoCollectsOpen: false,
        creatorAwardOpen: false,
        currencyOpen: false,
        editionOpen: false,
        edition: "",
        timeOpen: false,
        time: "",
      });
    } catch (err: any) {
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
    setUploadLoading(false);
  };

  const getCurrencies = async (): Promise<void> => {
    try {
      const response = await getEnabledCurrencies({
        limit: LimitType.TwentyFive,
      });
      if (response && response.data) {
        dispatch(setAvailableCurrencies(response.data.currencies.items));
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (availableCurrencies?.length < 1) {
      getCurrencies();
    }
  }, []);

  return {
    uploadLoading,
    handleVideoPost,
    postDetails,
    setPostDetails,
    openMeasure,
    setOpenMeasure,
  };
};

export default useUpload;
