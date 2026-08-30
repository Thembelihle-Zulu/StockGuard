import { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import { apiFetch } from "../utils/api";
import { DashboardPanel } from "../component/DashboardPanel";
import { PayPolicyAction } from "../component/PayPolicyAction";
import "../styles/claims-list.css";
import "../styles/farm-dashboard.css";
import "../styles/livestock-table.css";

export function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    apiFetch("payments")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/policy")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPolicies(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch("onboarding/animal")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const pendingPolicy = policies.find(
    (p) => p.status?.toLowerCase() === "pending",
  );
  const canActivate = pendingPolicy
    ? animals.length >= (pendingPolicy.animal_count_at_pricing ?? 0)
    : false;

  const handlePolicyPaid = (updated) => {
    setPolicies((prev) =>
      prev.map((p) =>
        p.policy_number === updated.policy_number ? updated : p,
      ),
    );
    apiFetch("payments")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  return (
    <section className="claims-page">
      <div className="claims-page-header">
        <h2 className="claims-page-title">Payments</h2>
      </div>

      {pendingPolicy && (
        <DashboardPanel
          title="Action Needed"
          subtitle={`Pay to activate ${pendingPolicy.policy_number}`}
        >
          <Typography sx={{ mb: 1.5, color: "oklch(0.4 0.02 154.55)" }}>
            {canActivate
              ? "All animals are registered — pay the first month's premium to activate cover."
              : `Register ${
                  (pendingPolicy.animal_count_at_pricing ?? 0) -
                  animals.length
                } more animal(s) from your Livestock page before you can pay.`}
          </Typography>
          <PayPolicyAction
            policy={pendingPolicy}
            canActivate={canActivate}
            onPaid={handlePolicyPaid}
          />
        </DashboardPanel>
      )}

      <DashboardPanel
        title="Payment History"
        subtitle="Premium payments for your policy"
      >
        {payments.length === 0 ? (
          <p className="policy-empty">
            No payments yet — payments appear here once you pay to activate
            your policy.
          </p>
        ) : (
          <ul className="claims-overview-list">
            {payments.map((payment) => (
              <li key={payment.id} className="claims-overview-row">
                <div className="claims-overview-info">
                  <span className="claims-overview-id">
                    {payment.policy_number}
                  </span>
                  <span className="claims-overview-desc">
                    {payment.payment_method} ·{" "}
                    {payment.created_date
                      ? new Date(payment.created_date).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                <div className="claims-overview-right">
                  <span className="claims-overview-amount">
                    R {Number(payment.amount).toLocaleString()}
                  </span>
                  <span className="status-pill status-pill--alive">
                    {payment.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DashboardPanel>
    </section>
  );
}
