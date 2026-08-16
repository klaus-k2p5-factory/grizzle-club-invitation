(() => {
  'use strict';

  const form = document.querySelector('#cost-calculator');
  const calculate = globalThis.EvCostCalculator?.calculateFirstYearCost;
  if (!form || !calculate) return;

  const attributedSource = window.EVRewardsAnalytics?.source;
  const campaign = attributedSource && attributedSource !== 'direct'
    ? attributedSource
    : 'organic-cost-calculator';
  const invitationLink = document.querySelector('#invitation-path-link');
  if (invitationLink) invitationLink.href = `../?src=${campaign}#request`;

  const byId = (id) => document.querySelector(`#${id}`);
  const fields = {
    scenario: byId('scenario'),
    annualKm: byId('annual-km'),
    homeChargingShare: byId('home-share'),
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
    monthlyElectricity: byId('monthly-electricity-result'),
    explanation: byId('result-explanation'),
    upfront: byId('upfront-result'),
    electricity: byId('electricity-result'),
    offsets: byId('offset-result'),
    energy: byId('energy-result'),
    deposit: byId('deposit-result'),
    rebateStatus: byId('rebate-status'),
    offsetsRow: byId('result-offset-row'),
    depositRow: byId('result-deposit-row')
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
  let buyHardwareValue = fields.hardwareCost.value;

  const readInput = () => ({
    annualKm: Number(fields.annualKm.value) * Number(fields.homeChargingShare.value) / 100,
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

    fields.hardwareCost.disabled = scenario !== 'buy';
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
      fields.hardwareCost.value = '0';
      help.textContent = 'The charger price is set to $0 because it is already paid for.';
      hardwareHelp.textContent = 'Already-owned hardware is not counted again.';
    } else if (scenario === 'buy') {
      fields.hardwareCost.value = buyHardwareValue || '700';
      help.textContent = 'The sample assumes you buy a charger.';
      hardwareHelp.textContent = 'Sample: $700. A planning number only—replace it with the charger price you find.';
    }
  };

  const render = () => {
    const result = calculate(readInput());
    const scenario = fields.scenario.value;
    output.scenario.textContent = scenarioLabels[scenario];
    output.net.textContent = money.format(result.firstYearNonRefundableCost);
    output.monthly.textContent = `${money.format(result.upfrontCashRequired)} upfront + about ${money.format(result.electricityCost / 12)}/month electricity`;
    output.upfront.textContent = money.format(result.upfrontCashRequired);
    output.monthlyElectricity.textContent = money.format(result.electricityCost / 12);
    output.electricity.textContent = money.format(result.electricityCost);
    output.offsets.textContent = money.format(result.totalOffsets);
    output.energy.textContent = `${energy.format(result.annualKwh)} kWh`;
    output.deposit.textContent = money.format(Number(fields.refundableDeposit.value) || 0);
    output.explanation.textContent = `Based on ${energy.format(Number(fields.annualKm.value) || 0)} km driven per year, ${fields.homeChargingShare.value}% charged at home, ${fields.kwhPer100Km.value || 0} kWh/100 km and ${money.format(Number(fields.electricityRate.value) || 0)} per kWh.`;
    output.offsetsRow.hidden = result.totalOffsets === 0;
    output.depositRow.hidden = Number(fields.refundableDeposit.value) <= 0;

    if (result.potentialRebate > 0 && !fields.rebateConfirmed.checked) {
      output.rebateStatus.hidden = false;
      output.rebateStatus.textContent = `${money.format(result.potentialRebate)} potential rebate is visible but not subtracted because confirmation is unchecked.`;
    } else if (result.appliedRebate > 0) {
      output.rebateStatus.hidden = false;
      output.rebateStatus.textContent = `${money.format(result.appliedRebate)} confirmed rebate is included. Re-check eligibility before committing to work.`;
    } else {
      output.rebateStatus.hidden = true;
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
  fields.hardwareCost.addEventListener('input', () => {
    if (fields.scenario.value === 'buy') buyHardwareValue = fields.hardwareCost.value;
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
    buyHardwareValue = '700';
    setTimeout(() => {
      updateScenario();
      render();
      fields.scenario.focus();
    }, 0);
  });

  updateScenario();
  render();
})();
