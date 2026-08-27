import { StatBlockRow } from "../../component/StatBlockRaw";
import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { PoliciesFilters } from "../../component/admin/PoliciesFilters";
import { PoliciesTable } from "../../component/admin/PoliciesTable";
import { PolicyModal } from "../../component/PolicyModal";

import "../../styles/admin-management.css";

const POLICIES_URL = "onboarding/policy/admin/all";
const FARMS_URL = "onboarding/farm_profile/admin/all";

const EMPTY_FILTERS = {
  search: "",
  farm: "",
  status: "",
};

export function PoliciesManagement() {
  const [policies, setPolicies] = useState([]);
  const [farmProfiles, setFarmProfiles] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  useEffect(() => {
    apiFetch(POLICIES_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    apiFetch(FARMS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setFarmProfiles(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const farmById = {};
  farmProfiles.forEach((f) => {
    farmById[f.id] = f;
  });

  const joinedPolicies = policies.map((policy) => {
    const farm = farmById[policy.farm_profile_id];
    return {
      ...policy,
      farm_name: farm?.farm_name,
    };
  });

  const filteredPolicies = joinedPolicies.filter((policy) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!policy.policy_number?.toLowerCase().includes(q)) return false;
    }

    if (filters.farm && policy.farm_profile_id !== filters.farm) {
      return false;
    }

    if (filters.status && policy.status !== filters.status) {
      return false;
    }

    return true;
  });

  const activeCount = policies.filter((p) => p.status === "Active").length;
  const cancelledCount = policies.filter(
    (p) => p.status === "Cancelled",
  ).length;
  const expiredCount = policies.filter((p) => p.status === "Expired").length;

  const handleStatusChange = (policyNumber, status) => {
    apiFetch(`onboarding/policy/admin/${policyNumber}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    })
      .then((res) => {
        if (!res.ok) {
          return Promise.reject("Failed to update");
        }
        return res.json();
      })
      .then((updated) => {
        setPolicies((prev) =>
          prev.map((p) =>
            p.policy_number === updated.policy_number ? updated : p,
          ),
        );
      })
      .catch(console.error);
  };

  const totalMonthlyPremiums = policies.reduce(
    (sum, p) => sum + (p.monthly_premium || 0),
    0,
  );

  return (
    <div className="livestock-management-page">
      <StatBlockRow
        stats={[
          { value: policies.length, label: "Total Policies", tone: "neutral" },
          { value: activeCount, label: "Active", tone: "success" },
          { value: cancelledCount, label: "Cancelled", tone: "danger" },
          { value: expiredCount, label: "Expired", tone: "warning" },
          {
            value: `R ${totalMonthlyPremiums.toLocaleString()}`,
            label: "Monthly Premiums",
            tone: "neutral",
          },
        ]}
      />

      <div className="filters-section">
        <PoliciesFilters
          filters={filters}
          setFilters={setFilters}
          farms={farmProfiles}
          onClear={() => setFilters(EMPTY_FILTERS)}
        />
      </div>

      <div className="table-section">
        <PoliciesTable
          rows={filteredPolicies}
          onView={(policy) => setSelectedPolicy(policy)}
          onStatusChange={handleStatusChange}
        />
      </div>

      {selectedPolicy && (
        <PolicyModal
          open={!!selectedPolicy}
          setOpen={(isOpen) => !isOpen && setSelectedPolicy(null)}
          policy={selectedPolicy}
        />
      )}
    </div>
  );
}
