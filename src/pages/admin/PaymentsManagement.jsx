import { useEffect, useState } from "react";
import { apiFetch } from "../../utils/api";
import { PaymentsTable } from "../../component/admin/PaymentsTable";
import "../../styles/admin-management.css";

const PAYMENTS_URL = "payments/admin/all";
const FARMS_URL = "onboarding/farm_profile/admin/all";

export function PaymentsManagement() {
  const [payments, setPayments] = useState([]);
  const [farmProfiles, setFarmProfiles] = useState([]);

  useEffect(() => {
    apiFetch(PAYMENTS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setPayments(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch(FARMS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setFarmProfiles(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const farmById = {};
  farmProfiles.forEach((f) => {
    farmById[f.id] = f;
  });

  const joinedPayments = payments.map((payment) => ({
    ...payment,
    farm_name: farmById[payment.farm_profile_id]?.farm_name,
  }));

  return (
    <div className="livestock-management-page">
      <div className="table-section">
        <PaymentsTable rows={joinedPayments} />
      </div>
    </div>
  );
}
