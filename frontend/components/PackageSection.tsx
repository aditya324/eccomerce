// components/PackageTabs.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import PlanCards from "./PlanCards";
import { BASEURL } from "@/constants";

import  { Plan } from "@/types/plan";




type PlansByCategory = Record<string, Plan[]>;

const categories = [
  { slug: "test-category", label: "Social Media Management" },
  { slug: "test-category2", label: "SEO (Local & On-Page)" },
  { slug: "performance-marketing", label: "Performance Marketing" },
];

export default function PackageTabs() {
  const [active, setActive] = useState(categories[0].slug);
  const [plansByCat, setPlansByCat] = useState<PlansByCategory>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!plansByCat[active]) {
      setLoading(true);
     
      axios
        .get<Plan[]>(`${BASEURL}/package/slug/${active}`)
        .then(({ data }) =>
          setPlansByCat((prev) => ({ ...prev, [active]: data }))
        )
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [active, plansByCat]);

  return (
    <div>
     
      <div className="mt-6 px-10">
        {loading && !plansByCat[active] ? (
          <p className="text-center">Loading plans…</p>
        ) : (
          <PlanCards
            plans={plansByCat[active] || []}
            onSelectPlan={(plan: Plan) => {
              console.log("selected plan", plan);
            }}
          />
        )}
      </div>
    </div>
  );
}
