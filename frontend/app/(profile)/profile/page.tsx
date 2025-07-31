


"use client";
import { BASEURL } from "@/constants";
import axios from "axios";
import React, { useState, useEffect } from "react";
import type { UserSubscription } from "@/types/service";


const Badge: React.FC<{ text: string; type: 'success' | 'info' }> = ({ text, type }) => {
    const baseClasses = "capitalize text-xs font-semibold px-3 py-1 rounded-full";
    const typeClasses = {
        success: "bg-green-500/10 text-green-400",
        info: "bg-sky-500/10 text-sky-400",
    };
    return <span className={`${baseClasses} ${typeClasses[type]}`}>{text}</span>;
};


const SubscriptionList: React.FC = () => {

  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get(`${BASEURL}/subscription/mine`, { withCredentials: true })
      .then((response) => {
        setSubscriptions(response.data);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <p className="text-white">Loading subscriptions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen ">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className=" min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-white mb-8">
          My Subscriptions
        </h1>

        {subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {subscriptions.map((sub, index) => (
              <div
                key={sub.subscriptionId}
                className="flex flex-col bg-slate-900 rounded-xl shadow-lg overflow-hidden border border-slate-800 transition-all duration-300 hover:shadow-indigo-500/20 hover:border-slate-700 animate-slide-in-up"
                style={{ animationDelay: `${index * 100}ms` }} // Staggered animation
              >
                {/* Card Header with Image */}
                <div className="relative">
                  <img
                    src={sub.service.thumbnail}
                    alt={sub.service.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                  <h2 className="absolute bottom-4 left-4 text-xl font-bold text-white">
                    {sub.service.title}
                  </h2>
                </div>
                
                {/* Card Body */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-4">
                     <p className="text-base font-medium text-slate-300">
                        {sub.package.title} Plan
                     </p>
                     <div className="flex gap-2">
                        <Badge text={sub.paymentStatus} type="info" />
                        <Badge text={sub.status} type="success" />
                     </div>
                  </div>
                  
                  {/* Price */}
                   <p className="text-3xl font-bold text-white mb-1">
                      ₹{sub.package.price.toLocaleString("en-IN")}
                      <span className="text-base font-normal text-slate-400">
                        / {sub.package.billingCycle}
                      </span>
                    </p>
                    <p className="text-xs text-slate-500">
                        Active since: {new Date(sub.currentStart).toLocaleDateString('en-GB')}
                    </p>

                  {/* Action Button */}
                  {/* <div className="mt-auto pt-6">
                    <button className="w-full text-center bg-indigo-600 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-indigo-500 transition-colors">
                        Manage
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-slate-900 rounded-lg">
            <p className="text-lg text-gray-400">You have no active subscriptions.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionList;
