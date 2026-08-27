import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { DashboardPanel } from "../component/DashboardPanel";
import "../styles/claims-list.css";
import "../styles/farm-dashboard.css";
import "../styles/livestock-table.css";

export function PaymentsList() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    apiFetch("payments")
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  return (
    <section className="claims-page">
      <div className="claims-page-header">
        <h2 className="claims-page-title">Payments</h2>
      </div>

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
