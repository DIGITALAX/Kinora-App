import { ChangeEvent } from "react";

const handleMediaUpload = async (
  e: ChangeEvent<HTMLInputElement>,
  loaderStart: () => void,
  loaderEnd: () => void,
  internalFunction: (e: string) => void
) => {
  loaderStart();
  try {
    const imageReaders = Array.from(e.target.files || []).map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    });

    await Promise.all(imageReaders).then((newImages: string[]) => {
      internalFunction(newImages[0]);
    });
  } catch (err: any) {
    console.error(err.message);
  }
  loaderEnd();
};

export default handleMediaUpload;
