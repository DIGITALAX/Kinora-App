import { FunctionComponent } from "react";
import { StoryboardDetailsProps } from "../../types/envoke.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY, IPFS_REGEX } from "../../../../../lib/constants";

const Details: FunctionComponent<StoryboardDetailsProps> = ({
  details,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-fit h-fit items-start justify-start opacity-70">
        Review your Quest storyboard before going live.
      </div>
      <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center">
        <div
          className={`relative flex items-center w-full h-44 rounded-md justify-center cursor-pointer p-px`}
          id="rainbow"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-md">
            <Image
              layout="fill"
              className="rounded-md"
              objectFit="cover"
              src={
                IPFS_REGEX.test(details?.cover)
                  ? `${INFURA_GATEWAY}/ipfs/${details?.cover}`
                  : details?.cover
              }
              draggable={false}
            />
            <div className="absolute w-full h-full top-0 right-0 rounded-md bg-black/70"></div>
          </div>
          <div className="absolute left-3 bottom-3 w-fit h-fit flex items-center justify-center">
            {details?.title}
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-start max-h-[10rem] overflow-y-scroll  whitespace-preline text-sm">
          {details?.description}
        </div>
      </div>
    </div>
  );
};

export default Details;
