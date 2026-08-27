import { useEffect, useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import { apiFetch } from "../utils/api";
import { DashboardPanel } from "../component/DashboardPanel";
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
  const [payOpen, setPayOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Card");

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

  // Same "pick the active one, else fall back to whatever's there"
  // selection FarmDashboard.jsx uses — there's only ever one policy
  // per farm profile, this just tolerates a non-Active one existing.
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

  const handlePay = () => {
    setPaying(true);
    setPayError(null);
    apiFetch(`payments/${policy.policy_number}`, {
      method: "POST",
      body: JSON.stringify({ payment_method: paymentMethod }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          throw new Error(body.message || "Payment failed.");
        }
        return res.json();
      })
      .then(({ policy: updated }) => {
        setPolicies((prev) =>
          prev.map((p) =>
            p.policy_number === updated.policy_number ? updated : p,
          ),
        );
        setPayOpen(false);
      })
      .catch((err) => setPayError(err.message))
      .finally(() => setPaying(false));
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
              <Button
                variant="contained"
                disabled={!canActivate}
                onClick={() => setPayOpen(true)}
                sx={{
                  mt: 2,
                  mr: 1.5,
                  textTransform: "none",
                  borderRadius: "2rem",
                  bgcolor: "oklch(0.32 0.1 154.55)",
                  "&:hover": { bgcolor: "oklch(0.27 0.1 154.55)" },
                }}
              >
                Pay & Activate — R {Number(policy.monthly_premium).toLocaleString()}
              </Button>
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

      <Dialog open={payOpen} onClose={() => setPayOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Pay & Activate Policy</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            R {Number(policy?.monthly_premium).toLocaleString()} — first
            month's premium for {policy?.policy_number}.
          </Typography>
          <FormControl>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <FormControlLabel value="Card" control={<Radio />} label="Debit / Credit Card" />
              <FormControlLabel value="Mobile Money" control={<Radio />} label="Mobile Money" />
            </RadioGroup>
          </FormControl>
          <Typography variant="caption" sx={{ display: "block", mt: 1.5, color: "oklch(0.55 0.01 90)" }}>
            No real payment is processed — this is a mock for demonstration.
          </Typography>
          {payError && (
            <Typography color="error" variant="body2" sx={{ mt: 1.5 }}>
              {payError}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPayOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handlePay} disabled={paying}>
            {paying ? "Processing..." : "Pay Now"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
