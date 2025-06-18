import { FunctionComponent, JSX } from "react";
import { ShippingInfoProps } from "../types/storefront.types";

const ShippingInfo: FunctionComponent<ShippingInfoProps> = ({
  fulfillmentDetails,
  setFulfillmentDetails,
  dict,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-3 items-center justify-center text-white">
      <div className="relative flex w-full h-full overflow-y-scroll">
        <div className="relative flex flex-col w-full h-fit justify-start items-center gap-3">
          <div className="relative w-fit h-fit break-words font-vcr text-acei text-xxs flex items-center justify-center text-center">
            {dict?.keys}
          </div>
          <div className="relative w-full h-fit inline-flex flex-wrap gap-1.5 items-center justify-center">
            <input
              placeholder={dict?.name}
              className="bg-black border h-8 border-moda p-1.5 font-vcr text-white text-xs rounded-sm w-full"
              value={fulfillmentDetails.name}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  name: e.target.value,
                })
              }
            />
            <input
              placeholder={dict?.addr}
              className="bg-black border border-moda p-1.5 font-vcr text-white w-full h-8 text-xs rounded-sm"
              value={fulfillmentDetails.address}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  address: e.target.value,
                })
              }
            />
            <div className="relative w-full h-fit flex items-center justify-center gap-1.5">
              <input
                placeholder={dict?.zip}
                className="bg-black border border-moda p-1.5 font-vcr w-full text-white text-xs h-8 rounded-sm"
                value={fulfillmentDetails.zip}
                onChange={(e) =>
                  setFulfillmentDetails({
                    ...fulfillmentDetails,
                    zip: e.target.value,
                  })
                }
              />
              <input
                placeholder={dict?.cit}
                className="bg-black border border-moda p-1.5 font-vcr w-full text-white text-xs h-8 rounded-sm"
                value={fulfillmentDetails.city}
                onChange={(e) =>
                  setFulfillmentDetails({
                    ...fulfillmentDetails,
                    city: e.target.value,
                  })
                }
              />
              <input
                placeholder={dict?.state}
                className="bg-black border border-moda p-1.5 font-vcr w-full text-white text-xs h-8 rounded-sm"
                value={fulfillmentDetails.state}
                onChange={(e) =>
                  setFulfillmentDetails({
                    ...fulfillmentDetails,
                    state: e.target.value,
                  })
                }
              />
            </div>
            <input
              placeholder={dict?.coun}
              className="bg-black border border-moda p-1.5 font-vcr w-full text-white text-xs h-8 rounded-sm"
              value={fulfillmentDetails.country}
              onChange={(e) =>
                setFulfillmentDetails({
                  ...fulfillmentDetails,
                  country: e.target.value,
                })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingInfo;
