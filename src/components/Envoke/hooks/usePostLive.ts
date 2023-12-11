import { useState } from "react";

const usePostLive = () => {
  const [postLoading, setPostLoading] = useState<boolean>(false);

  const handlePostLive = async () => {
    try {
    } catch (err: any) {
      console.error(err.message);
    }
  };

  return {
    handlePostLive,
    postLoading,
  };
};

export default usePostLive;
