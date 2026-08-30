import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { apiFetch } from "../utils/api";
import { DashboardPanel } from "../component/DashboardPanel";
import { PayPolicyAction } from "../component/PayPolicyAction";
import "../styles/claims-list.css";
import "../styles/farm-dashboard.css";
import "../styles/livestock-table.css";

const POLICY_STATUS_CLASS = {
  pending: "claim-status-badge claim-status-pending",
  active: "status-pill status-pill--alive",
  cancelled: "status-pill status-pill--deceased",
  expired: "status-pill status-pill--sick",
};

export function PoliciesList() {
  const [policies, setPolicies] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    apiFetch("onboarding/policy")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/animal")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const policy =
    policies.find((p) => p.status?.toLowerCase() === "active") || policies[0];

  const registeredCount = animals.length;
  const declaredCount = policy?.animal_count_at_pricing ?? 0;
  const progressPercent =
    declaredCount > 0
      ? Math.min(100, (registeredCount / declaredCount) * 100)
      : 0;
  const canActivate = registeredCount >= declaredCount;

  const updateStatus = (status) =>
    apiFetch(`onboarding/policy/${policy.policy_number}`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    }).then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Something went wrong.");
      }
      return res.json();
    });

  const handleCancel = () => {
    setCancelling(true);
    updateStatus("Cancelled")
      .then((updated) => {
        setPolicies((prev) =>
          prev.map((p) =>
            p.policy_number === updated.policy_number ? updated : p,
          ),
        );
        setCancelOpen(false);
      })
      .catch(console.error)
      .finally(() => setCancelling(false));
  };

  const handlePolicyPaid = (updated) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.policy_number === updated.policy_number ? updated : p,
      ),
    );
  };

  const statusKey = policy?.status?.toLowerCase();
  const canCancel = statusKey === "pending" || statusKey === "active";

  return (
    <section className="claims-page">
      <div className="claims-page-header">
        <h2 className="claims-page-title">My Policy</h2>
      </div>

      {!policy ? (
        <DashboardPanel title="Policy" subtitle="Current insurance coverage">
          <p className="policy-empty">No policy on file yet.</p>
        </DashboardPanel>
      ) : (
        <DashboardPanel
          title="Policy Details"
          subtitle="Current insurance coverage"
        >
          <div className="policy-top">
            <span className="policy-number">{policy.policy_number}</span>
            <span className={POLICY_STATUS_CLASS[statusKey] || "status-pill status-pill--unknown"}>
              {policy.status}
            </span>
          </div>

          <dl className="policy-details">
            <div className="policy-detail-row">
              <dt>Product ID</dt>
              <dd>{policy.product_id}</dd>
            </div>
            <div className="policy-detail-row">
              <dt>Monthly Premium</dt>
              <dd>R {Number(policy.monthly_premium).toLocaleString()}</dd>
            </div>
            {policy.insured_value_at_pricing != null && (
              <div className="policy-detail-row">
                <dt>Insured Value</dt>
                <dd>
                  R {Number(policy.insured_value_at_pricing).toLocaleString()}
                </dd>
              </div>
            )}
            <div className="policy-detail-row">
              <dt>Animals at Pricing</dt>
              <dd>{declaredCount}</dd>
            </div>
            <div className="policy-detail-row">
              <dt>Animals Registered</dt>
              <dd>{registeredCount}</dd>
            </div>
            <div className="policy-detail-row">
              <dt>Policy Start</dt>
              <dd>
                {policy.creation_date
                  ? new Date(policy.creation_date).toLocaleDateString()
                  : "—"}
              </dd>
            </div>
          </dl>

          {statusKey === "pending" && (
            <div className="policy-renewal-wrap">
              <div className="policy-renewal-labels">
                <span>Animals registered toward activation</span>
                <span className="policy-renewal-days">
                  {registeredCount} / {declaredCount}
                </span>
              </div>
              <div className="policy-renewal-track">
                <div
                  className="policy-renewal-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              {!canActivate && (
                <Typography
                  variant="caption"
                  sx={{ display: "block", mt: 1, color: "oklch(0.55 0.01 90)" }}
                >
                  Register {declaredCount - registeredCount} more animal(s)
                  from your Livestock page to activate coverage.
                </Typography>
              )}
            </div>
          )}

          <div className="policy-actions">
            {statusKey === "pending" && (
              <PayPolicyAction
                policy={policy}
                canActivate={canActivate}
                onPaid={handlePolicyPaid}
                buttonSx={{
                  mt: 2,
                  mr: 1.5,
                  textTransform: "none",
                  borderRadius: "2rem",
                  bgcolor: "oklch(0.32 0.1 154.55)",
                  "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
                }}
              />
            )}

            {canCancel && (
              <Button
                color="error"
                variant="outlined"
                onClick={() => setCancelOpen(true)}
                sx={{ mt: 2, textTransform: "none", borderRadius: "2rem" }}
              >
                Cancel Policy
              </Button>
            )}
          </div>
        </DashboardPanel>
      )}

      <Dialog open={cancelOpen} onClose={() => setCancelOpen(false)}>
        <DialogTitle>Cancel this policy?</DialogTitle>
        <DialogContent>
          Cancelling policy {policy?.policy_number} will end your insurance
          coverage. This can't be undone from here.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelOpen(false)}>Keep Policy</Button>
          <Button color="error" onClick={handleCancel} disabled={cancelling}>
            {cancelling ? "Cancelling..." : "Cancel Policy"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
