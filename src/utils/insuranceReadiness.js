const ELIGIBLE_INSPECTION_STATUS = "approved";

export function computeReadiness({ farmProfile, animals, inspections, policy }) {
  const registeredCount = animals.length;

  const inspectionByAnimalId = {};
  inspections.forEach((inspection) => {
    inspectionByAnimalId[inspection.livestock_id] = inspection;
  });

  let inspectedCount = 0;
  let eligibleCount = 0;
  let pendingReviewCount = 0;
  let deniedCount = 0;

  animals.forEach((animal) => {
    const inspection = inspectionByAnimalId[animal.id];
    if (!inspection) return;

    inspectedCount += 1;
    const status = (inspection.status || "pending").toLowerCase();
    if (status === ELIGIBLE_INSPECTION_STATUS) eligibleCount += 1;
    else if (status === "denied") deniedCount += 1;
    else pendingReviewCount += 1;
  });

  const notInspectedCount = registeredCount - inspectedCount;
  const ineligibleCount = registeredCount - eligibleCount;

  const hasFarmProfile = !!farmProfile;
  const hasLivestock = registeredCount > 0;
  const policyActive = policy?.status === "Active";

  const coveragePercent =
    registeredCount > 0 ? Math.round((inspectedCount / registeredCount) * 100) : 0;
  const eligibilityPercent =
    registeredCount > 0 ? Math.round((eligibleCount / registeredCount) * 100) : 0;

  const pillars = [
    hasFarmProfile ? 100 : 0,
    hasLivestock ? 100 : 0,
    coveragePercent,
    eligibilityPercent,
    policyActive ? 100 : 0,
  ];
  const readinessScore = Math.round(
    pillars.reduce((sum, p) => sum + p, 0) / pillars.length,
  );

  const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

  const checklist = [
    { label: "Farm Profile Complete", met: hasFarmProfile },
    { label: `${plural(registeredCount, "Animal")} Registered`, met: hasLivestock },
    {
      label: `${plural(inspectedCount, "Animal")} Inspected`,
      met: hasLivestock && notInspectedCount === 0,
    },
    {
      label: `${plural(notInspectedCount, "Animal")} Still Need Inspection`,
      met: notInspectedCount === 0,
    },
    { label: `${plural(eligibleCount, "Claim Eligible Animal")}`, met: eligibleCount > 0 },
    { label: "Policy Active", met: policyActive },
  ];

  let nextAction;
  if (!hasFarmProfile) {
    nextAction = {
      title: "Complete Farm Profile",
      description:
        "Your farm profile needs to be completed before you can register livestock or get covered.",
      ctaLabel: "Complete Farm Profile",
      target: "onboarding",
    };
  } else if (!hasLivestock) {
    nextAction = {
      title: "Register Livestock",
      description:
        "Register your animals to begin the inspection and insurance readiness process.",
      ctaLabel: "Register Livestock",
      target: "livestock",
    };
  } else if (notInspectedCount > 0) {
    nextAction = {
      title: "Animals Missing Inspections",
      description: `${plural(notInspectedCount, "animal")} haven't been inspected yet — uninspected animals can't be claimed.`,
      ctaLabel: "View Livestock",
      target: "livestock",
    };
  } else if (pendingReviewCount > 0) {
    nextAction = {
      title: "Inspections Pending Review",
      description: `${plural(pendingReviewCount, "inspection")} still awaiting approval before those animals become claim eligible.`,
      ctaLabel: "View Inspections",
      target: "inspections",
    };
  } else if (!policyActive) {
    nextAction = {
      title: "Activate Your Policy",
      description:
        "Your animals are inspected, but your policy still needs to be activated before you can submit claims.",
      ctaLabel: "View Policy",
      target: "policies",
    };
  } else if (eligibleCount > 0) {
    nextAction = {
      title: "You Are Ready to Submit Claims",
      description: `${plural(eligibleCount, "animal")} eligible. You can file a claim any time.`,
      ctaLabel: "Submit a Claim",
      target: "claims",
    };
  } else {
    nextAction = {
      title: "No Eligible Animals Yet",
      description: "None of your animals currently have an approved inspection.",
      ctaLabel: "View Inspections",
      target: "inspections",
    };
  }

  return {
    registeredCount,
    inspectedCount,
    notInspectedCount,
    eligibleCount,
    ineligibleCount,
    pendingReviewCount,
    deniedCount,
    coveragePercent,
    eligibilityPercent,
    readinessScore,
    hasFarmProfile,
    hasLivestock,
    policyActive,
    checklist,
    nextAction,
  };
}
