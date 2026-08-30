const MONTHLY_RATE = 0.0065;
const MINIMUM_PREMIUM = 100;

const COVERAGE_MULTIPLIERS = {
  basic: 1,
  full: 1.5,
};

export function getPremium(totalHerdValue, coverageTier = "basic") {
  const value = Number(totalHerdValue) || 0;
  const multiplier = COVERAGE_MULTIPLIERS[coverageTier] ?? 1;

  const monthlyPremium = Math.max(
    MINIMUM_PREMIUM,
    Math.round(value * MONTHLY_RATE * multiplier),
  );

  return {
    monthlyPremium,
    tierLabel: `R ${value.toLocaleString()} insured value`,
  };
}
