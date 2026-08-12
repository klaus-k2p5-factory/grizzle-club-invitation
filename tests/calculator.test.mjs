import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { calculateFirstYearCost, normalizeNumber } = require('../calculator-core.js');

test('normalizeNumber accepts finite numeric strings and clamps negatives', () => {
  assert.equal(normalizeNumber('12.5'), 12.5);
  assert.equal(normalizeNumber(-8), 0);
  assert.equal(normalizeNumber('not-a-number'), 0);
  assert.equal(normalizeNumber(Infinity), 0);
});

test('calculateFirstYearCost computes energy, cash required, offsets and net cost', () => {
  const result = calculateFirstYearCost({
    annualKm: 20000,
    kwhPer100Km: 20,
    electricityRate: 0.12,
    hardwareCost: 1000,
    shippingCost: 100,
    installationCost: 1500,
    maintenanceReserve: 100,
    programFees: 0,
    refundableDeposit: 300,
    rewardRate: 0.03,
    rebateAmount: 500,
    rebateConfirmed: true
  });

  assert.equal(result.annualKwh, 4000);
  assert.equal(result.electricityCost, 480);
  assert.equal(result.estimatedRewards, 120);
  assert.equal(result.appliedRebate, 500);
  assert.equal(result.upfrontCashRequired, 2900);
  assert.equal(result.firstYearNonRefundableCost, 2560);
  assert.equal(result.averageMonthlyCost, 2560 / 12);
});

test('unconfirmed rebates are displayed as potential but not subtracted', () => {
  const result = calculateFirstYearCost({ rebateAmount: 750, rebateConfirmed: false });
  assert.equal(result.potentialRebate, 750);
  assert.equal(result.appliedRebate, 0);
  assert.equal(result.totalOffsets, 0);
});

test('refundable deposit affects upfront cash but not non-refundable cost', () => {
  const result = calculateFirstYearCost({ refundableDeposit: 400 });
  assert.equal(result.upfrontCashRequired, 400);
  assert.equal(result.firstYearNonRefundableCost, 0);
});

test('out-of-range finite inputs cannot overflow calculator results', () => {
  const result = calculateFirstYearCost({
    annualKm: '1e308',
    kwhPer100Km: '1e308',
    electricityRate: '1e308',
    hardwareCost: '1e308',
    shippingCost: '1e308',
    installationCost: '1e308',
    maintenanceReserve: '1e308',
    programFees: '1e308',
    refundableDeposit: '1e308',
    rewardRate: '1e308',
    rebateAmount: '1e308',
    rebateConfirmed: true
  });

  for (const [name, value] of Object.entries(result)) {
    assert.ok(Number.isFinite(value), `${name} must remain finite`);
  }
  assert.equal(result.annualKwh, 200000);
});

test('invalid and negative inputs cannot create fabricated savings or costs', () => {
  const result = calculateFirstYearCost({
    annualKm: -100,
    kwhPer100Km: 'x',
    electricityRate: -0.5,
    hardwareCost: -400,
    rebateAmount: -1000,
    rewardRate: -1,
    rebateConfirmed: true
  });
  assert.deepEqual(result, {
    annualKwh: 0,
    electricityCost: 0,
    estimatedRewards: 0,
    potentialRebate: 0,
    appliedRebate: 0,
    totalOffsets: 0,
    upfrontCashRequired: 0,
    firstYearNonRefundableCost: 0,
    averageMonthlyCost: 0
  });
});

test('decimal strings produce stable numeric results', () => {
  const result = calculateFirstYearCost({
    annualKm: '12345.5',
    kwhPer100Km: '17.8',
    electricityRate: '0.098'
  });
  assert.ok(Math.abs(result.annualKwh - 2197.499) < 1e-9);
  assert.ok(Math.abs(result.electricityCost - 215.354902) < 1e-9);
});
