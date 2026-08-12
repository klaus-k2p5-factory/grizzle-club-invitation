((root, factory) => {
  const api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.EvCostCalculator = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, () => {
  'use strict';

  const LIMITS = {
    annualKm: 200000,
    kwhPer100Km: 100,
    electricityRate: 5,
    hardwareCost: 100000,
    shippingCost: 100000,
    installationCost: 250000,
    maintenanceReserve: 100000,
    programFees: 100000,
    refundableDeposit: 100000,
    rewardRate: 1,
    rebateAmount: 250000
  };

  const normalizeNumber = (value, max = Number.MAX_VALUE) => {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.min(number, max) : 0;
  };

  const calculateFirstYearCost = (input = {}) => {
    const annualKm = normalizeNumber(input.annualKm, LIMITS.annualKm);
    const kwhPer100Km = normalizeNumber(input.kwhPer100Km, LIMITS.kwhPer100Km);
    const electricityRate = normalizeNumber(input.electricityRate, LIMITS.electricityRate);
    const hardwareCost = normalizeNumber(input.hardwareCost, LIMITS.hardwareCost);
    const shippingCost = normalizeNumber(input.shippingCost, LIMITS.shippingCost);
    const installationCost = normalizeNumber(input.installationCost, LIMITS.installationCost);
    const maintenanceReserve = normalizeNumber(input.maintenanceReserve, LIMITS.maintenanceReserve);
    const programFees = normalizeNumber(input.programFees, LIMITS.programFees);
    const refundableDeposit = normalizeNumber(input.refundableDeposit, LIMITS.refundableDeposit);
    const rewardRate = normalizeNumber(input.rewardRate, LIMITS.rewardRate);
    const potentialRebate = normalizeNumber(input.rebateAmount, LIMITS.rebateAmount);
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
