import { FunctionComponent } from "react";
import { SuccessProps } from "../types/modals.types";
import { ImCross } from "react-icons/im";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { setSuccess } from "../../../../redux/reducers/successSlice";

const Success: FunctionComponent<SuccessProps> = ({
  dispatch,
  image,
  text
}): JSX.Element => {
  return (
    <div className="inset-0 justify-center fixed z-50 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-[90vw] rounded-md sm:w-[70vw] tablet:w-[40vw] h-fit max-h-[90vh] place-self-center bg-offBlack rounded-lg border border-white rounded-sm overflow-y-scroll">
        <div className="relative w-full h-full flex flex-col gap-5 p-2">
          <div className="relative w-fit h-fit items-end justify-end ml-auto cursor-pointer flex">
            <ImCross
              color="white"
              size={10}
              onClick={() => dispatch(setSuccess({
                open: false
              }))}
            />
          </div>
          <div className="relative w-full h-fit items-center justify-center flex flex-col gap-3 pb-4">
            <div className="relative w-2/3 h-fit items-center justify-center text-center break-words font-bit text-white text-sm">
              {text}
            </div>
            <div
              className="relative w-full sm:w-2/3 h-full min-h-[25vh] flex items-center justify-center rounded-sm p-px"
              id="northern"
            >
              <Image
                className="rounded-sm"
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/${image}`}
                draggable={false}
                objectFit="cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
