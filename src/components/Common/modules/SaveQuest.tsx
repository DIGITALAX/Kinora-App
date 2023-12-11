import { FunctionComponent } from "react";
import { SaveQuestProps } from "../types/common.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import handleSaveQuest from "../../../../lib/helpers/handleSaveQuest";

const SaveQuest: FunctionComponent<SaveQuestProps> = ({
  questSaved,
  lensConnected,
  dispatch,
  questId,
  questFeed,
  setItemFeed,
  post
}): JSX.Element => {
  return (
    <div
      className={`absolute right-4 bottom-4 hover:opacity-80 w-7 p-1 h-7 bg-black border border-white rounded-full flex items-center justify-center ${
        questSaved && "mix-blend-hard-light hue-rotate-60"
      } ${
        !lensConnected?.id ? "opacity-80" : "cursor-pointer active:scale-95"
      }`}
      title="Save Quest"
      onClick={() =>
        handleSaveQuest(
          questId,
          dispatch,
          lensConnected,
          questFeed,
          setItemFeed,
          post
        )
      }
    >
      <div className="relative w-4 h-5 flex items-center justify-center">
        <Image
          draggable={false}
          layout="fill"
          src={`${INFURA_GATEWAY}/ipfs/QmQG559iscGC7YY4pQCsQn4tfWG3k76dMjFmXnnxeoELzs`}
        />
      </div>
    </div>
  );
};

export default SaveQuest;
