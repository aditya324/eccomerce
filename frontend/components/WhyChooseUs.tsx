"use client";

import { Check } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-6 bg-gradient-to-br from-[#fff] to-[#fef8ee]">
      {/* Left Box */}
      <div className="border p-6 rounded-md">
        <h3 className="text-xl font-bold mb-6 text-gray-800">
          Why Choose Our <br />
          UI/UX Design Services?
        </h3>
        <ul className="space-y-4 text-gray-700">
          {[
            "we collaborate asynchronously",
            "we send updates and announcements",
            "we train and build teams",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="text-black w-5 h-5 mt-1" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Box */}
      <div className="border p-6 rounded-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">What We Will Do:</h3>
        <p className="text-gray-700 text-lg leading-relaxed">
          At Sunrise Digital, we focus on creating not just beautiful designs but user-centric,
          high-performing interfaces
        </p>
      </div>
    </div>
  );
}
