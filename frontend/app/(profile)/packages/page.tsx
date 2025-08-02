// src/components/MySubscriptionsPage.tsx
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Subscription } from '@/types/package'; 


const CheckIcon = () => (
  <svg className="w-5 h-5 mr-2 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
  </svg>
);


const SubscriptionCard: React.FC<{ subscription: Subscription }> = ({ subscription }) => {
  const { packageId, status, subscriptionId } = subscription;
  const isFeatured = packageId.isFeatured;

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform transform hover:-translate-y-1 ${isFeatured ? 'border-2 border-[#F0B100]' : ''}`}>
      {isFeatured && (
        <div className="bg-[#F0B100] text-white text-center py-1 text-sm font-bold">
          Featured
        </div>
      )}
      <div className="p-6">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">{packageId.title}</h3>
          <span className={`capitalize text-xs font-semibold px-3 py-1 rounded-full ${status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
            {status}
          </span>
        </div>
        <p className="text-gray-500 text-sm mb-4">Subscription ID: {subscriptionId}</p>
        <div className="my-4">
          <span className="text-4xl font-extrabold text-gray-900">${packageId.price}</span>
          <span className="text-lg text-gray-500 capitalize">/{packageId.billingCycle}</span>
        </div>
        <ul className="space-y-3 mb-6">
          {packageId.features.map((feature, index) => (
            <li key={index} className="flex items-center text-gray-600">
              <CheckIcon />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        {/* <button className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Manage Subscription
        </button> */}
      </div>
    </div>
  );
};



const MySubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = 'http://localhost:4000/api/package/my-package';

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        
        const response = await axios.get<Subscription[]>(API_URL, {
            withCredentials:true
        });

      
        setSubscriptions(response.data);

      } catch (e) {
      
        if (axios.isAxiosError(e)) {
            setError(`Failed to fetch data: ${e.message}`);
        } else if (e instanceof Error) {
            setError(`An unexpected error occurred: ${e.message}`);
        }
        console.error("Fetching subscriptions failed:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);


  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-500">Loading your packages...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg text-red-500">{error}</p></div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">My Subscriptions</h1>
        <p className="text-center text-gray-600 mb-12">Here are your active and past subscription packages.</p>

        {subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {subscriptions.map((sub) => (
              <SubscriptionCard key={sub.subscriptionId} subscription={sub} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">You don`&apos;`t have any subscriptions yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MySubscriptionsPage;