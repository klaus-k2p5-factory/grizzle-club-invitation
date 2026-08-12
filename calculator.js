(() => {
  'use strict';

  const form = document.querySelector('#cost-calculator');
  const calculate = globalThis.EvCostCalculator?.calculateFirstYearCost;
  if (!form || !calculate) return;

  const byId = (id) => document.querySelector(`#${id}`);
  const fields = {
    scenario: byId('scenario'),
    annualKm: byId('annual-km'),
    kwhPer100Km: byId('efficiency'),
    electricityRate: byId('electricity-rate'),
    hardwareCost: byId('hardware-cost'),
    shippingCost: byId('shipping-cost'),
    installationCost: byId('installation-cost'),
    maintenanceReserve: byId('maintenance-reserve'),
    programFees: byId('program-fees'),
    refundableDeposit: byId('deposit'),
    rewardRate: byId('reward-rate'),
    rebateAmount: byId('rebate-amount'),
    rebateConfirmed: byId('rebate-confirmed')
  };

  const output = {
    scenario: byId('result-scenario'),
    net: byId('net-result'),
    monthly: byId('monthly-result'),
    upfront: byId('upfront-result'),
    electricity: byId('electricity-result'),
    offsets: byId('offset-result'),
    energy: byId('energy-result'),
    deposit: byId('deposit-result'),
    rebateStatus: byId('rebate-status')
  };

  const money = new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  const energy = new Intl.NumberFormat('en-CA', { maximumFractionDigits: 0 });

  const scenarioLabels = {
    buy: 'Buying a charger',
    own: 'Already own a charger',
    supplied: 'Considering a Club-supplied charger'
  };
  let rewardRateAutoSuggested = false;
  let rewardRateUserEdited = false;

  const readInput = () => ({
    annualKm: fields.annualKm.value,
    kwhPer100Km: fields.kwhPer100Km.value,
    electricityRate: fields.electricityRate.value,
    hardwareCost: fields.hardwareCost.value,
    shippingCost: fields.shippingCost.value,
    installationCost: fields.installationCost.value,
    maintenanceReserve: fields.maintenanceReserve.value,
    programFees: fields.programFees.value,
    refundableDeposit: fields.refundableDeposit.value,
    rewardRate: fields.rewardRate.value,
    rebateAmount: fields.rebateAmount.value,
    rebateConfirmed: fields.rebateConfirmed.checked
  });

  const updateScenario = () => {
    const scenario = fields.scenario.value;
    const help = byId('scenario-help');
    const hardwareHelp = byId('hardware-help');

    fields.hardwareCost.disabled = scenario === 'supplied';
    if (scenario === 'supplied') {
      fields.hardwareCost.value = '0';
      if (Number(fields.rewardRate.value) === 0 && !rewardRateUserEdited) {
        fields.rewardRate.value = '0.03';
        rewardRateAutoSuggested = true;
      }
      help.textContent = 'Current Club terms use a $0 hardware purchase price for approved supplied-charger members; deposit, shipping and installation still apply.';
      hardwareHelp.textContent = 'Locked at $0 purchase price for this scenario. The supplied charger is not owned by the member during membership.';
    } else if (scenario !== 'supplied' && rewardRateAutoSuggested) {
      fields.rewardRate.value = '0';
      rewardRateAutoSuggested = false;
    }

    if (scenario === 'own') {
      help.textContent = 'Keep hardware at $0 if it is already paid for, or enter a planned replacement or upgrade.';
      hardwareHelp.textContent = 'Use $0 for sunk cost, or enter a replacement/upgrade amount.';
    } else if (scenario === 'buy') {
      help.textContent = 'Enter the hardware price you expect to pay.';
      hardwareHelp.textContent = 'Enter purchase price before any rebate.';
    }
  };

  const render = () => {
    const result = calculate(readInput());
    const scenario = fields.scenario.value;
    output.scenario.textContent = scenarioLabels[scenario];
    output.net.textContent = money.format(result.firstYearNonRefundableCost);
    output.monthly.textContent = `${money.format(result.averageMonthlyCost)} average per month`;
    output.upfront.textContent = money.format(result.upfrontCashRequired);
    output.electricity.textContent = money.format(result.electricityCost);
    output.offsets.textContent = money.format(result.totalOffsets);
    output.energy.textContent = `${energy.format(result.annualKwh)} kWh`;
    output.deposit.textContent = money.format(Number(fields.refundableDeposit.value) || 0);

    if (result.potentialRebate > 0 && !fields.rebateConfirmed.checked) {
      output.rebateStatus.textContent = `${money.format(result.potentialRebate)} potential rebate is visible but not subtracted because confirmation is unchecked.`;
    } else if (result.appliedRebate > 0) {
      output.rebateStatus.textContent = `${money.format(result.appliedRebate)} confirmed rebate is included. Re-check eligibility before committing to work.`;
    } else {
      output.rebateStatus.textContent = 'No rebate is included unless you confirm it above.';
    }
  };

  let timer;
  const queueRender = () => {
    clearTimeout(timer);
    timer = setTimeout(render, 120);
  };

  fields.rewardRate.addEventListener('input', () => {
    rewardRateUserEdited = true;
    rewardRateAutoSuggested = false;
  });
  form.addEventListener('input', queueRender);
  fields.scenario.addEventListener('change', () => {
    updateScenario();
    render();
  });
  form.addEventListener('change', render);
  byId('recalculate').addEventListener('click', render);
  form.addEventListener('reset', () => {
    rewardRateUserEdited = false;
    rewardRateAutoSuggested = false;
    setTimeout(() => {
      updateScenario();
      render();
      fields.scenario.focus();
    }, 0);
  });

  updateScenario();
  render();
})();
