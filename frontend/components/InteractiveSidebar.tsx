"use client"
import React, { useState, useEffect } from 'react';
import type { UserSubscription } from '@/types/service'; 

// --- Simple SVG Icons for the Accordion ---
const ChevronDownIcon: React.FC = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ChevronUpIcon: React.FC = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
    </svg>
);


const InteractiveSidebar: React.FC = () => {
   
    const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [openSubscriptionId, setOpenSubscriptionId] = useState<string | null>(null);

   

    // --- Function with typed parameter ---
    const handleToggle = (id: string): void => {
        setOpenSubscriptionId(openSubscriptionId === id ? null : id);
    };

    return (
        <aside className="w-96 bg-slate-900 text-gray-300 p-4 flex flex-col min-h-screen">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white">Your Account</h2>
                <p className="text-sm text-slate-400">Manage your services</p>
            </div>

            <div className="flex-grow">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 px-2">
                    Active Services
                </h3>
                {isLoading ? (
                    <p className="px-2">Loading...</p>
                ) : (
                    <ul className="space-y-2">
                        {subscriptions.map((sub) => {
                            const isOpen = openSubscriptionId === sub.subscriptionId;
                            return (
                                <li key={sub.subscriptionId} className="bg-slate-800/50 rounded-lg transition-all duration-300">
                                    <button
                                        onClick={() => handleToggle(sub.subscriptionId)}
                                        className="w-full flex justify-between items-center p-3 text-left"
                                    >
                                        <span className="font-semibold text-white">{sub.service.title}</span>
                                        {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
                                    </button>
                                    {isOpen && (
                                        <div className="px-3 pb-4 space-y-3">
                                            <img 
                                                src={sub.service.thumbnail} 
                                                alt={sub.service.title} 
                                                className="w-full h-32 object-cover rounded-md" 
                                            />
                                            <div className="flex justify-between items-baseline">
                                                <p className="text-sm text-slate-400">{sub.package.title} Plan</p>
                                                <p className="font-bold text-white">
                                                    ₹{sub.package.price.toLocaleString('en-IN')}
                                                    <span className="text-sm font-normal text-slate-400">/mo</span>
                                                </p>
                                            </div>
                                            <a href="#" className="block w-full text-center bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-500 transition-colors">
                                                Manage
                                            </a>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
             
             <div className="mt-8 border-t border-slate-700 pt-4">
                 <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
                    My Packages
                </h3>
                <p className="text-sm text-slate-500 px-2">Package info will go here.</p>
            </div>
        </aside>
    );
};

export default InteractiveSidebar;