import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { FunctionComponent, JSX } from "react";
import { TextProps } from "../types/common.types";

const Text: FunctionComponent<TextProps> = ({
  metadata,
  disabled,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3">
      <div
        className={`relative w-full h-fit max-h-[20rem] font-vcr text-white text-left items-start justify-start rounded-sm break-words flex overflow-y-scroll py-3 text-xs whitespace-preline ${
          metadata?.__typename !== "TextOnlyMetadata" &&
          metadata?.content?.length > 200
            ? "bg-black"
            : "bg-oscuro"
        }`}
        dangerouslySetInnerHTML={{
          __html: descriptionRegex(
            disabled
              ? metadata?.content?.slice(0, 100) + "..."
              : metadata?.content,
            metadata?.__typename !== "TextOnlyMetadata" &&
              metadata?.content?.length > 200
              ? false
              : true
          ),
        }}
      ></div>
    </div>
  );
};

export default Text;
