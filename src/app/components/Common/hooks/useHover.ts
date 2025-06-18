import {
  fetchAccountStats,
  follow,
  unfollow,
} from "@lens-protocol/client/actions";
import { useContext, useEffect, useState } from "react";
import { ModalContext } from "@/app/providers";
import { Account, AccountStats } from "@lens-protocol/client";
import { Indexar } from "../types/common.types";

const useHover = (dict: any, profile: Account, stats?: boolean) => {
  const context = useContext(ModalContext);
  const [followLoading, setFollowLoading] = useState<boolean>(false);
  const [accountStats, setAccountStats] = useState<AccountStats>();

  const handleUnfollow = async () => {
    if (!context?.lensConectado?.sessionClient) return;
    setFollowLoading(true);
    try {
      context?.setIndexar(Indexar.Indexando);
      const res = await unfollow(context?.lensConectado?.sessionClient, {
        account: profile?.address,
      });

      if (!res?.isOk()) {
        context?.setModalOpen(dict.error);
        setFollowLoading(false);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);
        context?.setLensConectado((prev) => ({
          ...prev,
          profile: {
            ...prev?.profile!,
            operations: {
              ...prev?.profile!?.operations!,
              isFollowedByMe: false,
            },
          },
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setFollowLoading(false);
  };

  const handleFollow = async () => {
    if (!context?.lensConectado?.sessionClient) return;
    setFollowLoading(true);
    try {
      context?.setIndexar(Indexar.Indexando);
      const res = await follow(context?.lensConectado?.sessionClient, {
        account: profile?.address,
      });

      if (!res?.isOk()) {
        context?.setModalOpen(dict.error);
        setFollowLoading(false);
      } else if ((res.value as any)?.reason?.includes("Signless")) {
        context?.setSignless?.(true);
      } else {
        context?.setIndexar(Indexar.Success);
        context?.setLensConectado((prev) => ({
          ...prev,
          profile: {
            ...prev?.profile!,
            operations: {
              ...prev?.profile!?.operations!,
              isFollowedByMe: true,
            },
          },
        }));
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setTimeout(() => {
      context?.setIndexar(Indexar.Inactive);
    }, 3000);
    setFollowLoading(false);
  };

  const handleStats = async () => {
    try {
      const res = await fetchAccountStats(context?.clienteLens!, {
        account: profile?.address,
      });

      if (res?.isOk()) {
        setAccountStats(res?.value as AccountStats);
      }
    } catch (err: any) {
      console.error(err?.message);
    }
  };

  useEffect(() => {
    if (stats && !accountStats && context?.clienteLens && profile) {
      handleStats();
    }
  }, [stats, context?.clienteLens, profile]);

  return {
    followLoading,
    handleFollow,
    handleUnfollow,
    accountStats,
  };
};

export default useHover;
