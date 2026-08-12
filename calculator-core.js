((root, factory) => {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.EvCostCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';

  const normalizeNumber = (value) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  };

  const calculateFirstYearCost = (input = {}) => {
    const annualKm = normalizeNumber(input.annualKm);
    const kwhPer100Km = normalizeNumber(input.kwhPer100Km);
    const electricityRate = normalizeNumber(input.electricityRate);
    const hardwareCost = normalizeNumber(input.hardwareCost);
    const shippingCost = normalizeNumber(input.shippingCost);
    const installationCost = normalizeNumber(input.installationCost);
    const maintenanceReserve = normalizeNumber(input.maintenanceReserve);
    const programFees = normalizeNumber(input.programFees);
    const refundableDeposit = normalizeNumber(input.refundableDeposit);
    const rewardRate = normalizeNumber(input.rewardRate);
    const potentialRebate = normalizeNumber(input.rebateAmount);
    const appliedRebate = input.rebateConfirmed ? potentialRebate : 0;

    const annualKwh = annualKm * kwhPer100Km / 100;
    const electricityCost = annualKwh * electricityRate;
    const estimatedRewards = annualKwh * rewardRate;
    const totalOffsets = appliedRebate + estimatedRewards;
    const upfrontCashRequired = hardwareCost + shippingCost + installationCost + refundableDeposit;
    const firstYearNonRefundableCost = hardwareCost + shippingCost + installationCost +
      electricityCost + maintenanceReserve + programFees - totalOffsets;

    return {
      annualKwh,
      electricityCost,
      estimatedRewards,
      potentialRebate,
      appliedRebate,
      totalOffsets,
      upfrontCashRequired,
      firstYearNonRefundableCost,
      averageMonthlyCost: firstYearNonRefundableCost / 12
    };
  };

  return { normalizeNumber, calculateFirstYearCost };
});
