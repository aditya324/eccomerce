
"use client";
import React, { useState } from "react";
import SubscribeButton from "./SubscribeButton";

interface Plan {
  _id: string; 
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
}


interface PlanCardsProps {
  plans: Plan[];

  onSelectPlan?: (plan: Plan) => void; 
}

export default function PlanCards({ plans, onSelectPlan }: PlanCardsProps) {
  const [yearlyMap, setYearlyMap] = useState<Record<string, boolean>>({});

  if (!plans || plans.length === 0) {
    return <p className="text-center mt-6">No plans available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
   
      {plans.map((plan, idx) => {

        const isFeatured = idx === 1; 
        const baseClasses = "relative flex flex-col rounded-xl p-6 transition-transform";
        const styleClasses = isFeatured
          ? "bg-white shadow-2xl scale-105 z-10"
          : "bg-white shadow";

        return (
          <div key={plan._id} className={`${baseClasses} ${styleClasses}`}>
   
            <h2 className="text-lg font-medium mb-4 capitalize">{plan.title}</h2>

    
            <p className="text-3xl font-bold mb-1">
              ₹
              {(yearlyMap[plan._id]
                ? plan.price * 12
                : plan.price
              ).toLocaleString()}
            </p>
            <p className="text-gray-500 mb-6 uppercase text-sm">
              per {yearlyMap[plan._id] ? "year" : plan.billingCycle}
            </p>


            <ul className="flex-1 space-y-3 mb-6">
           
              {plan.features.map((feat, i) => (
                <li key={i} className="flex items-start">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0 mt-1 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{feat}</span>
                </li>
              ))}
            </ul>

            <SubscribeButton packageId={plan._id} />
          </div>
        );
      })}
    </div>
  );
}