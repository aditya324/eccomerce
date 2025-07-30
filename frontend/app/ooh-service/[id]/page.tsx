"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { BASEURL } from "@/constants";
import TrustedByLogos from "@/components/TrustedByLogos";
import WhyChooseUs from "@/components/WhyChooseUs";
import AllServiceExcept from "../../../components/AllServiceExcept";

interface Package {
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
  packageType: "Static" | "Digital";
  subType: string;
}

interface OOHService {
  id: string;
  title: string;
  price: number;
  thumbnail: string;
  description: string[];
  includes: string[];
  location: string;
}

const FILTERS: Record<"Static" | "Digital", string[]> = {
  Static: ["Hoarding", "Inside Railway Station", "Popups"],
  Digital: ["LED", "Ticket Counter", "Platform TV"]
};

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const Dropdown = ({ label, options, value, onChange }: DropdownProps) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-yellow-400 focus:border-yellow-400"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">All</option>
      {options.map((option) => (
        <option value={option} key={option}>{option}</option>
      ))}
    </select>
  </div>
);

export default function OOHDetailsPage() {
  const { id } = useParams();
  const [ooh, setOoh] = useState<OOHService | null>(null);
  const [packageType, setPackageType] = useState<"Static" | "Digital" | "">("");
  const [subType, setSubType] = useState<string>("");
  const [filteredPackages, setFilteredPackages] = useState<Package[]>([]);

  useEffect(() => {
    if (!id) return;

    axios.get(`${BASEURL}/oohservices/getOOHById/${id}`).then((res) => {
      setOoh(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (!id || !subType) return;

    axios.get(`${BASEURL}/oohservices/${id}/packages?subType=${subType}`).then((res) => {
      setFilteredPackages(res.data.packages);
    });
  }, [id, subType]);

  if (!ooh) return <div className="text-center py-8 text-lg">Loading OOH service...</div>;

  return (
    <div className="bg-white">
      <div className="flex flex-col md:flex-row justify-center items-start gap-6 px-4 py-12">
        <div className="rounded-lg shadow-lg overflow-hidden" style={{ width: "666px", height: "488px" }}>
          <img src={ooh.thumbnail} alt={ooh.title} className="w-full h-full object-contain" />
        </div>

        <div className="border-2 border-yellow-400 rounded-lg p-6 shadow-md flex flex-col justify-between" style={{ width: "344px", height: "492px" }}>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{ooh.title}</h2>
            <p className="text-sm text-gray-500 uppercase">Starting at</p>
            <p className="text-2xl font-semibold text-orange-600">₹{ooh.price}</p>
            <p className="text-sm text-gray-600">📍 {ooh.location}</p>

            <Dropdown label="Package Type" options={Object.keys(FILTERS)} value={packageType} onChange={(val) => { setPackageType(val as "Static" | "Digital"); setSubType(""); }} />
            {packageType && (
              <Dropdown label="Sub-Type" options={FILTERS[packageType]} value={subType} onChange={setSubType} />
            )}

            <button className="bg-yellow-400 hover:bg-yellow-500 transition text-white w-full py-2 rounded font-semibold">Contact Us</button>

            <div className="border border-yellow-400 text-yellow-700 p-3 rounded bg-yellow-50 text-sm">
              <p className="font-bold">🚀 Boost Your Visibility!</p>
              <p>OOH Ads deliver unmatched reach and recall.</p>
            </div>
          </div>

          <div className="pt-4 text-gray-500 text-xs space-y-1">
            <p>🛡️ Verified Location</p>
            <p>📆 Book for a month or more</p>
          </div>
        </div>

        <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm" style={{ width: "344px", height: "492px" }}>
          <h3 className="text-xl font-semibold mb-4">Includes</h3>
          <ul className="space-y-3 text-base text-gray-800">
            {ooh.includes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {subType && (
        <div className="bg-gray-50 py-10 px-6 md:px-20">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Packages for: {subType}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, i) => (
              <div key={i} className="border-2 rounded-lg shadow-md p-6 bg-white hover:shadow-lg transition">
                <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-sm text-gray-500 mb-2">Type: {pkg.packageType}</p>
                <p className="text-sm text-gray-500 mb-2">Sub-Type: {pkg.subType}</p>
                <p className="text-orange-600 font-bold text-lg mb-2">₹{pkg.price}</p>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1 mb-4">
                  {pkg.features.map((feature, j) => (
                    <li key={j}>{feature}</li>
                  ))}
                </ul>
                <button className="bg-yellow-400 hover:bg-yellow-500 w-full py-2 text-white font-semibold rounded">
                  Get This Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 py-12 px-6 md:px-20">
        <h2 className="text-[28px] font-normal text-[#333333] font-[Quicksand] mb-6">What You Get</h2>
        <ul className="list-disc pl-6 space-y-4">
          {ooh.description.map((point, index) => (
            <li key={index} className="text-[20px] text-[#333333] font-[Quicksand]">
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="py-12">
        <h1 className="flex justify-center font-bold text-4xl text-[#333333] font-inter">Trusted by 600+ clients</h1>
        <TrustedByLogos />
      </div>

      <WhyChooseUs />
      <AllServiceExcept id={id as string} />
    </div>
  );
}
