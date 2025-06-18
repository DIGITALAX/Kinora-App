import { INFURA_GATEWAY } from "@/app/lib/constants";
import { VideoMetadata } from "@lens-protocol/client";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { FunctionComponent, JSX, useContext } from "react";
import InteractBar from "../../Common/modules/InteractBar";
import { buildCover } from "@/app/lib/helpers/getVideoCover";
import { MetricsAddedProps } from "../types/activity.types";
import { ModalContext } from "@/app/providers";

const MetricsAdded: FunctionComponent<MetricsAddedProps> = ({
  width,
  height,
  quest,
  dict,
  disabled,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const poster = buildCover(
    quest?.details?.cover && quest?.details?.cover?.trim() !== ""
      ? quest?.details?.cover
      : (quest?.post?.metadata as VideoMetadata)?.video?.item
  );
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px flex rounded-lg cursor-pointer"
        id="rainbow"
        style={{
          width,
          height,
        }}
        onClick={() => {
          router.push(`/video/${quest?.post?.id}`);
          context?.setRouterChangeLoading(true);
        }}
      >
        <div className="relative rounded-lg w-full h-full flex items-center justify-center">
          {poster && (
            <Image
              src={poster}
              objectFit="cover"
              draggable={false}
              className="rounded-lg"
              layout="fill"
            />
          )}
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center justify-end sm:justify-between font-bit break-words gap-3">
        <div className="relative flex flex-row gap-1.5 items-center justify-center w-fit h-fit">
          <div className="relative w-3 h-3 flex items-center justify-center">
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmS6GgvqEKRjvXtYfiXWTQZMz7nt2ucuKFaWv8sTgUDGNq`}
            />
          </div>
          <div className="text-gris relative flex items-center justify-center text-xxs break-words whitespace-preline">
            {dict?.metA}
          </div>
        </div>
        <div className="relative w-fit h-fit flex items-center justify-end text-white text-right sm:text-sm text-xs break-words">
          {Number((quest?.post?.metadata as VideoMetadata)?.title?.length) > 20
            ? (quest?.post?.metadata as VideoMetadata)?.title?.slice(0, 20) +
              "..."
            : (quest?.post?.metadata as VideoMetadata)?.title}
        </div>
      </div>
      <div className="relative w-full mr-0 h-fit flex items-center justify-end text-suave text-xxs font-bit flex-row gap-1">
        <div className="flex items-center justify-center top-px relative">
          {dict?.new}
        </div>
        <div className="relative w-3 h-3 flex items-center justify-center">
          <Image
            draggable={false}
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmNoZzuUVsCDT5pYS7TNp1YkUmU5vDav7AwaoYZ8Jeuhrx`}
          />
        </div>
      </div>
      {!disabled && <InteractBar post={quest?.post!} dict={dict} border />}
    </div>
  );
};

export default MetricsAdded;
