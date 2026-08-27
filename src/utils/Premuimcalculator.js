// Price as a percentage of insured value, not banded headcount. The old
// tier tables gave every animal in the same band the identical flat fee —
// a 1-animal and a 10-animal farm in the same small-scale band paid the
// same total premium, and a 101-animal and a 10,000-animal commercial
// herd paid the same uncapped flat fee. Pricing off total declared value
// scales with actual risk exposure instead.
//
// MONTHLY_RATE and MINIMUM_PREMIUM are placeholder figures, same caveat
// as before — not actuarial advice, just a structurally sound starting
// point to tune once real figures exist.
const MONTHLY_RATE = 0.0035; // ~4.2%/year of insured value
const MINIMUM_PREMIUM = 100; // floor so a tiny/cheap herd still covers admin cost

const COVERAGE_MULTIPLIERS = {
  basic: 1,
  full: 1.5,
};

/**
 * @param {number} totalHerdValue estimated total insured value (R)
 * @param {"basic"|"full"} coverageTier
 * @returns {{ monthlyPremium: number, tierLabel: string }}
 */
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
