import Head from "next/head";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NextPage } from "next";

const Custom404: NextPage = (): JSX.Element => {
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );

  return (
    <>
      <Head>
        <title>Page Not Found</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
        style={{
          height: "calc(100vh - 5.5rem)",
        }}
      >
        <div
          className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col"
          style={{
            width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
          }}
          id={!openSidebar ? "closeSide" : ""}
        >
          <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-sm">
            Lost?
          </div>
        </div>
      </div>
    </>
  );
};

export default Custom404;
