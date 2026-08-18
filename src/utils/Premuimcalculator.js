// Small-scale: bands 1–10, 11–20, 21–30 (30 is the small-scale ceiling)
// Commercial: 30+ starts here, bands 30–50, 51–100, 100+
// Edit these numbers freely — this is just placeholder pricing until you
// have real actuarial figures.
const SMALL_SCALE_TIERS = [
  { min: 1, max: 10, basePremium: 150 },
  { min: 11, max: 20, basePremium: 250 },
  { min: 21, max: 30, basePremium: 350 },
];

const COMMERCIAL_TIERS = [
  { min: 30, max: 50, basePremium: 600 },
  { min: 51, max: 100, basePremium: 1000 },
  { min: 101, max: Infinity, basePremium: 1800 },
];

const COVERAGE_MULTIPLIERS = {
  basic: 1,
  full: 1.5,
};

function findTier(tiers, animalCount) {
  const tier = tiers.find((t) => animalCount >= t.min && animalCount <= t.max);
  // fall back to the last (highest) tier if count exceeds every band
  return tier || tiers[tiers.length - 1];
}

/**
 * @param {"Small-scale"|"Commercial"} farmType
 * @param {number} animalCount
 * @param {"basic"|"full"} coverageTier
 * @returns {{ monthlyPremium: number, tierLabel: string }}
 */
export function getPremium(farmType, animalCount, coverageTier = "basic") {
  const count = Number(animalCount) || 1;
  const isCommercial = farmType?.toLowerCase() === "commercial";
  const tiers = isCommercial ? COMMERCIAL_TIERS : SMALL_SCALE_TIERS;
  const tier = findTier(tiers, count);
  const multiplier = COVERAGE_MULTIPLIERS[coverageTier] ?? 1;

  return {
    monthlyPremium: Math.round(tier.basePremium * multiplier),
    tierLabel: `${tier.min}${tier.max === Infinity ? "+" : `–${tier.max}`} animals`,
  };
}
