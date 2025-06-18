import { JSX } from "react";
import ModalsEntry from "../../Modals/modules/ModalsEntry";
import Footer from "./Footer";
import HeaderEntry from "./HeaderEntry";

export default function Wrapper({
  dict,
  page,
}: {
  dict: any;
  page: JSX.Element;
}) {
  return (
    <div className="relative w-full h-full flex bg-fuzz flex-col">
      <HeaderEntry dict={dict} />
      {page}
      <ModalsEntry dict={dict} />
      <Footer />
    </div>
  );
}
