// src/components/MyOohServicesPage.tsx
"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { OohSubscription } from '@/types/Ooh'; // Adjust path if needed
import { BASEURL } from '@/constants';

// Helper function to format dates nicely
const formatDate = (dateString: string | null) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};


const OohServiceCard: React.FC<{ subscription: OohSubscription }> = ({ subscription }) => {
  const { oohServiceId, status, currentStart, subscriptionId, paymentStatus } = subscription;


 
  // Define styles for different statuses
  const statusStyles: { [key: string]: string } = {
    active: 'bg-green-100 text-green-800',
    created: 'bg-yellow-100 text-yellow-800',
  };
  const statusClassName = statusStyles[status] || 'bg-gray-100 text-gray-800';

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl">
      <img className="w-full h-48 object-cover" src={oohServiceId.thumbnail} alt={oohServiceId.title} />
      
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-xl font-bold text-gray-900">{oohServiceId.title}</h3>
          <span className={`capitalize text-xs font-semibold px-3 py-1 rounded-full ${statusClassName}`}>
            {status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">by {oohServiceId.vendorName}</p>
        
        <div className="space-y-2 text-sm text-gray-700 mt-auto">
          <div className="flex justify-between">
            <span className="font-semibold">Subscription ID:</span>
            <span>{subscriptionId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Start Date:</span>
            <span>{formatDate(currentStart)}</span>
          </div>
          {/* <div className="flex justify-between">
            <span className="font-semibold">Payment:</span>
            <span className="capitalize font-medium">{paymentStatus}</span>
          </div> */}
        </div>

        {/* {status === 'created' && (
          <button className="mt-4 w-full bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 transition-colors">
            Complete Payment
          </button>
        )}
         {status === 'active' && (
          <button className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
            View Details
          </button>
        )} */}
      </div>
    </div>
  );
};


// --- Main Page Component ---
const MyOohServicesPage = () => {
  const [subscriptions, setSubscriptions] = useState<OohSubscription[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const API_URL = `${BASEURL}/oohservices/myoohpackage`;

  useEffect(() => {
    const fetchOohSubscriptions = async () => {
      try {
        const response = await axios.get<OohSubscription[]>(API_URL ,{
            withCredentials:true
        });
        setSubscriptions(response.data);
      } catch (e) {
        if (axios.isAxiosError(e)) {
            setError(`Failed to fetch data: ${e.message}`);
        } else if (e instanceof Error) {
            setError(`An unexpected error occurred: ${e.message}`);
        }
        console.error("Fetching OOH subscriptions failed:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOohSubscriptions();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg text-gray-500">Loading your services...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen"><p className="text-lg text-red-500">{error}</p></div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-4">My OOH Services</h1>
        <p className="text-center text-gray-600 mb-12">Manage your out-of-home advertising subscriptions.</p>

        {subscriptions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {subscriptions.map((sub) => (
              <OohServiceCard key={sub.subscriptionId} subscription={sub} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">You haven`&apos;`t subscribed to any OOH services yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOohServicesPage;