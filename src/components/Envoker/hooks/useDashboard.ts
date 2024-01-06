import { useEffect, useState } from "react";
import { AccountType } from "../types/envoker.types";

const useDashboard = (accountSwitch: AccountType) => {
  const [dashboardLoading, setDashboardLoading] = useState<boolean>(false);

  const getDashboardData = async () => {
    setDashboardLoading(true);
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setDashboardLoading(false);
  };

  useEffect(() => {
    if (accountSwitch === AccountType.Dashboard) {
      getDashboardData();
    }
  }, [accountSwitch]);

  return {
    dashboardLoading,
  };
};

export default useDashboard;
