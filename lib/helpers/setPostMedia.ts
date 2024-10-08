import { MakePostComment } from "@/components/Quest/types/quest.types";
import { ChangeEvent, SetStateAction } from "react";

const setPostMedia = async (
  e: ChangeEvent<HTMLInputElement>,
  type: string,
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void,
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void,
  index: number,
  t: (key: string) => string
) => {
  if (!e.target.files) return;

  if (type === t("video")) {
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        video: true,
      };
      return arr;
    });
    const videoReaders = Array.from(e.target.files).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(videoReaders).then((newVideos: string[]) => {
      setMakePostComment((prev) => {
        const arr = [...prev];
        arr[index] = {
          ...arr[index],
          videos: [...prev[index]?.videos, ...newVideos] as string[],
        };
        return arr;
      });
    });
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        video: false,
      };
      return arr;
    });
  } else {
    setContentLoading((prev) => {
      const arr = [...prev];
      arr[index] = {
        ...arr[index],
        image: true,
      };
      return arr;
    });
    let types: string[] = [];
    const imageReaders = Array.from(e.target.files).map((file) => {
      types.push(file.type);
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(imageReaders).then((newImages: string[]) => {
      setMakePostComment((prev) => {
        const arr = [...(prev || [])];
        arr[index] = {
          ...(arr[index] || {}),
          images: [
            ...(prev[index]?.images || []),
            ...newImages?.map((item, index) => ({
              media: item,
              type: types?.[index],
            })),
          ],
        };
        return arr;
      });
    });
    setContentLoading((prev) => {
      const arr = [...(prev || [])];
      arr[index] = {
        ...(arr[index] || {}),
        image: false,
      };
      return arr;
    });
  }
};

export default setPostMedia;
