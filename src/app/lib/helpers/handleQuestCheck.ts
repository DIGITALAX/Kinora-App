import {
  ERC20Reward,
  ERC721Reward,
  GatingLogic,
  MilestoneEnvoke,
  QuestDetails,
  VideoEligible,
} from "@/app/components/Envoke/types/envoke.types";

const handleQuestCheck = (quest: {
  details: QuestDetails;
  milestones: MilestoneEnvoke[];
}): boolean => {
  if (
    !quest.details.title.trim() ||
    !quest.details.description.trim() ||
    !quest.details.cover.trim()
  ) {
    return false;
  }
  if (quest.details.tags.split(",").every((tag) => !tag.trim())) {
    return false;
  }
  if (quest.details.maxPlayerCount <= 0) {
    return false;
  }
  if (!validateGatingLogic(quest?.details?.gated)) {
    return false;
  }

  for (const milestone of quest.milestones) {
    if (!validateGatingLogic(milestone?.gated)) {
      return false;
    }
    if (
      !milestone.details.title.trim() ||
      !milestone.details.cover.trim() ||
      !milestone.details.description.trim()
    ) {
      return false;
    }
    if (!validateRewards(milestone.rewards)) {
      return false;
    }
    if (!validateVideoEligible(milestone.eligibility)) {
      return false;
    }
  }
  return true;
};

export default handleQuestCheck;

const validateGatingLogic = (gatingLogic: GatingLogic): boolean => {
  return (
    (gatingLogic?.erc20Addresses || [])?.length ===
      (gatingLogic.erc20Thresholds || [])?.length ||
    (gatingLogic.erc721TokenIds || [])?.length ===
      (gatingLogic?.erc721Addresses || [])?.length
  );
};

const validateRewards = (rewards: {
  rewards721: ERC721Reward[];
  rewards20: ERC20Reward[];
}): boolean => {
  if (rewards?.rewards721?.length > 0) {
    for (const reward of rewards?.rewards721) {
      if (
        !reward.details.title.trim() ||
        !reward.details.media.trim() ||
        !reward.details.description.trim()
      ) {
        return false;
      }
      if (
        !reward.details.mediaCover.trim() &&
        (!reward.details.images.length || !reward.details.images[0].trim())
      ) {
        return false;
      }
    }
  }

  if (rewards?.rewards20?.length > 0) {
    for (const reward of rewards?.rewards20) {
      if (!reward.address.trim() || Number(reward.amount) <= 0) {
        return false;
      }
    }
  }

  return rewards?.rewards721?.length > 0 || rewards?.rewards20?.length > 0;
};

const validateVideoEligible = (eligibilities: VideoEligible[]): boolean => {
  for (const eligibility of eligibilities) {
    if (
      eligibility?.criteria &&
      Object.values(eligibility?.criteria)?.length === 0
    ) {
      return false;
    }
    if (!eligibility?.video) {
      return false;
    }
  }
  return eligibilities.length > 0;
};
