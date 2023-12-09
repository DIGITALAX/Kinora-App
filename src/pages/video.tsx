import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export default function Video() {
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end"
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
      ></div>
    </div>
  );
}
