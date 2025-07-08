"use client";

import { Check } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <div className="mx-auto px-4 py-12 flex flex-col md:flex-row gap-6 justify-center items-center">
      {/* Left Box */}
      <div className="w-[644px] h-[334px] border border-gray-300 rounded-md p-6 bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-6 leading-snug">
          Why Choose Our <br />
          UI/UX Design Services?
        </h3>
        <ul className="space-y-4 text-gray-800">
          {[
            "we collaborate asynchronously",
            "we send updates and announcements",
            "we train and build teams",
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="text-black w-5 h-5 mt-1" />
              <span className="text-base">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Box */}
      <div className="w-[644px] h-[334px] border border-gray-300 rounded-md p-6 bg-white">
        <h3 className="text-xl font-bold text-gray-900 mb-4">What We Will Do:</h3>
        <p className="text-gray-800 text-lg leading-relaxed">
          At Sunrise Digital, we focus on creating not just beautiful designs but
          user-centric, high-performing interfaces.
        </p>
      </div>
    </div>
  );
}
