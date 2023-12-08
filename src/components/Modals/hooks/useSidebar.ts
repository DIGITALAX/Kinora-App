import { useState } from "react";

const useSidebar = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);

  return {
    openSidebar,
    setOpenSidebar,
  };
};

export default useSidebar;
