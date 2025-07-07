// components/PlanCards.jsx
"use client";
import React, { useState } from "react";

export default function PlanCards({ plans, onSelectPlan }) {
  const [yearlyMap, setYearlyMap] = useState<{ [key: string]: boolean }>({});
  if (!plans || plans.length === 0) {
    return <p className="text-center mt-6">No plans available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((plan, idx) => {
        // Choose styling based on index
        const isBasic = idx === 1;
        const baseClasses =
          "relative flex flex-col rounded-xl p-6 transition-transform";
        const styleClasses = isBasic
          ? "bg-white shadow-2xl scale-105 z-10"
          : "bg-white shadow";

        return (
          <div key={plan._id} className={`${baseClasses} ${styleClasses}`}>
            {/* Yearly Toggle */}
            <div className="absolute top-4 right-4 flex items-center space-x-1">
              <span className="text-sm text-gray-500">Yearly</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={!!yearlyMap[plan._id]}
                  onChange={() =>
                    setYearlyMap((prev) => ({
                      ...prev,
                      [plan._id]: !prev[plan._id],
                    }))
                  }
                />

                <div className="w-9 h-5 bg-gray-200 peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:bg-yellow-500 transition-colors"></div>
                <div className="absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full peer-checked:translate-x-4 transition-transform shadow"></div>
              </label>
            </div>

            {/* Title */}
            <h2 className="text-lg font-medium mb-4 capitalize">
              {plan.title}
            </h2>

            {/* Price */}
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
            <p className="text-gray-500 mb-6 uppercase text-sm">
              per {plan.billingCycle}
            </p>

            {/* Features */}
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

            {/* CTA */}
            <button
              onClick={() =>
                onSelectPlan({
                  ...plan,
                  billingCycle: yearlyMap[plan._id]
                    ? "yearly"
                    : plan.billingCycle,
                  price: yearlyMap[plan._id] ? plan.price * 12 : plan.price,
                })
              }
              className="mt-auto bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-colors text-center"
            >
              Get a plan
            </button>
          </div>
        );
      })}
    </div>
  );
}
