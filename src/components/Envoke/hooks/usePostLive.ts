import { useState } from "react";
import { Dispatch } from "redux";
import { setQuestInfo } from "../../../../redux/reducers/questInfoSlice";

const usePostLive = (dispatch: Dispatch) => {
  const [postLoading, setPostLoading] = useState<boolean>(false);

  const handlePostLive = async () => {
    setPostLoading(true);
    try {
      dispatch(
        setQuestInfo({
          actionDetails: {
            title: "",
            description: "",
            cover: "",
            tags: "",
          },
          actionMilestones: [],
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setPostLoading(false);
  };

  return {
    handlePostLive,
    postLoading,
  };
};

export default usePostLive;
