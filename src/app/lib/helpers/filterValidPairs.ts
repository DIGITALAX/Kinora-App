
const filterValidErc20Pairs = (addresses: string[], thresholds: number[]) => {
  let validAddresses = addresses.filter(
    (address) =>
      address && address.trim() !== "" && address !== "0x" && address !== "0x00"
  );

  let validThresholds = thresholds.filter(
    (threshold) => Number(threshold || 0) > 0
  );

  let finalAddresses = [];
  let finalThresholds = [];
  let thresholdIndex = 0;

  for (let i = 0; i < validAddresses.length; i++) {
    if (thresholdIndex < validThresholds.length) {
      finalAddresses.push(validAddresses[i]);
      finalThresholds.push(validThresholds[thresholdIndex]);
      thresholdIndex++;
    }
  }

  return { finalAddresses, finalThresholds };
};

export default filterValidErc20Pairs;
