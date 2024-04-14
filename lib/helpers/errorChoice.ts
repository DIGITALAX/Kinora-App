import { Action, Dispatch } from "redux";
import { setIndexer } from "../../redux/reducers/indexerSlice";
import { setInteractError } from "../../redux/reducers/interactErrorSlice";

const errorChoice = async (
  err: any,
  runner: (() => Promise<void>) | (() => void),
  dispatch: Dispatch<Action>,
  t: (key: string) => string
) => {
  if (err?.message?.includes("User rejected the request")) return;
  if (
    !err?.messages?.includes("Block at number") &&
    !err?.message?.includes("could not be found")
  ) {
    dispatch(setInteractError(true));
    console.error(err.message);
  } else {
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: t("suc"),
      })
    );

    if (runner() instanceof Promise) {
      await runner();
    } else {
      runner();
    }

    setTimeout(() => {
      dispatch(
        setIndexer({
          actionOpen: false,
          actionMessage: undefined,
        })
      );
    }, 3000);
  }
};

export default errorChoice;
