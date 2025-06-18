import { ModalContext } from "@/app/providers";
import { useContext, useState } from "react";
import { Indexar, SimpleCollect } from "../../Common/types/common.types";
import { post } from "@lens-protocol/client/actions";
import uploadPostContent from "@/app/lib/helpers/uploadPostContent";

const useUpload = (dict: any) => {
  const context = useContext(ModalContext);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [postDetails, setPostDetails] = useState<{
    title: string;
    description: string;
    video: string;
    tags: string;
    collectDetails: SimpleCollect;
  }>({
    title: "",
    description: "",
    video: "",
    tags: "",
    collectDetails: {},
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
    if (!context?.isEnvoker) {
      context?.setSuccess({
        text: dict?.idea,
        image: "QmYTAxWEr9qm6p6R5GzRoRDJXBmC5bxMBpg3XZcPKqRNmp",
      });
      return;
    }
    if (
      !postDetails?.description ||
      !postDetails?.title ||
      !postDetails?.video ||
      !context?.lensConectado?.profile
    )
      return;
    setUploadLoading(true);
    try {
      const contentURI = await uploadPostContent(
        context?.clienteAlmacenamiento!,
        postDetails.description?.trim() == "" ? " " : postDetails.description,
        [],
        [postDetails?.video],
        [],
        postDetails.title,
        postDetails?.tags
          ?.split(",")
          .map((tag) => tag?.trim())
          .filter((tag) => tag.length > 0),
        getVideoCover()
      );

      const res = await post(
        context?.lensConectado?.sessionClient! ?? context?.clienteLens!,
        {
          contentUri: contentURI?.uri,
          actions: [
            {
              simpleCollect: postDetails?.collectDetails,
            },
          ],
        }
      );

      if (!res?.isOk()) {
        context?.setModalOpen((res as any).error);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);

        setPostDetails({
          title: "",
          description: "",
          video: "",
          tags: "",
          collectDetails: {},
        });
      }
    } catch (err: any) {
      if (
        !err?.messages?.includes("Block at number") &&
        !err?.message?.includes("could not be found")
      ) {
        context?.setModalOpen(dict?.error);
        console.error(err.message);
      } else {
        context?.setIndexar(Indexar.Success);
      }
    }
    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setUploadLoading(false);
  };

  return {
    uploadLoading,
    handleVideoPost,
    postDetails,
    setPostDetails,
  };
};

export default useUpload;
