import { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { Inspection } from "../component/Inspection";
import { ListItems } from "../component/ListItems";
import { InspectionsFilters } from "../component/InspectionsFilters";
import "../styles/claims-list.css";

const INSPECTIONS_URL = "onboarding/inspection";
const ANIMALS_URL = "onboarding/animal";

const EMPTY_FILTERS = {
  search: "",
  species: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

export function InspectionsList() {
  const [inspections, setInspections] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  useEffect(() => {
    apiFetch(INSPECTIONS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setInspections(Array.isArray(data) ? data : []))
      .catch(console.error);

    apiFetch(ANIMALS_URL)
      .then((res) => (res.ok ? res.json() : Promise.reject("error")))
      .then((data) => setAnimals(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);

  const animalById = {};
  animals.forEach((a) => {
    animalById[a.id] = a;
  });

  // Single-hop join, same shape as the admin page's inspection ->
  // animal step — just no second hop to farm, since this list is
  // already scoped to the requester's own farm on the backend.
  const joinedInspections = inspections.map((inspection) => {
    const animal = animalById[inspection.livestock_id];
    return {
      ...inspection,
      tag_number: animal?.tag_number,
      species: animal?.species,
      estimated_value: animal?.estimated_value,
    };
  });

  const filterFn = (inspection) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!inspection.tag_number?.toLowerCase().includes(q)) return false;
    }

    if (filters.species && inspection.species !== filters.species) {
      return false;
    }

    if (filters.status && (inspection.status || "pending") !== filters.status) {
      return false;
    }

    if (filters.dateFrom) {
      if (
        !inspection.inspection_date ||
        inspection.inspection_date < filters.dateFrom
      ) {
        return false;
      }
    }

    if (filters.dateTo) {
      if (
        !inspection.inspection_date ||
        inspection.inspection_date > filters.dateTo
      ) {
        return false;
      }
    }

    return true;
  };

  return (
    <section className="claims-page">
      <div className="claims-page-header">
        <h2 className="claims-page-title">My Inspections</h2>
      </div>

      <InspectionsFilters
        filters={filters}
        setFilters={setFilters}
        onClear={() => setFilters(EMPTY_FILTERS)}
      />

      <ListItems
        Component={Inspection}
        items={joinedInspections}
        filterFn={filterFn}
        emptyState={
          <div className="list-empty-state">
            <p className="list-empty-state-title">No vet reports yet.</p>
            <p>
              Uninspected animals aren't eligible for claims — use "Submit
              Vet Report" on your Dashboard to upload one for any
              registered animal.
            </p>
          </div>
        }
      />
    </section>
  );
}
