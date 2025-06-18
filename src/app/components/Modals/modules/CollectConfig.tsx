import { FunctionComponent, JSX, useContext } from "react";
import { ModalContext } from "@/app/providers";
import { ImCross } from "react-icons/im";
import CollectOptions from "../../Upload/modules/CollectOptions";

const CollectConfig: FunctionComponent<{ dict: any }> = ({
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);

  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] md:w-[50vw] h-fit max-h-[90vh] min-h-[27vh] place-self-center bg-offBlack border border-white overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-3 p-2 items-center justify-start">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="#FBDB86"
              size={10}
              onClick={() => context?.setCollectOptions({ open: false })}
            />
          </div>

          <div className="relative w-full h-fit flex items-start justify-start overflow-x-scroll">
            <CollectOptions collect dict={dict} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectConfig;
