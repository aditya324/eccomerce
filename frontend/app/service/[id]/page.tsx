// FILE: app/service/[id]/page.tsx

import { notFound } from "next/navigation";
import TrustedByLogos from "@/components/TrustedByLogos";
import WhyChooseUs from "@/components/WhyChooseUs";
import AllServiceExcept from "../../../components/AllServiceExcept";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PricingCards from "@/components/PricingCards";
import ServiceWishlistButton from "@/components/ServiceWishlistButton";

// ✅ This tells Next.js to always render the page on-demand
export const dynamic = 'force-dynamic';

// Define the Service interface
interface Service {
  _id: string;
  title: string;
  price: number;
  thumbnail: string;
  includes: string[];
  description: string[];
  faqs: { question: string; answer: string }[];
  packages: any[];
  rating: number;
  videoUrl: string;
}

// ❌ The generateStaticParams function has been REMOVED.

// This function fetches data for a single page on the server
async function getService(id: string): Promise<Service | undefined> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/service/getServiceById/${id}`, {
      cache: 'no-store', // Important: Don't cache data for a dynamic page
    });
    if (!res.ok) {
      return undefined;
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch service:", error);
    return undefined;
  }
}

// The main page component
export default async function ServiceDetails({ params }: { params: { id: string } }) {
  const { id } = params;
  const service = await getService(id);

  if (!service) {
    notFound();
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-center items-start gap-6 px-4 py-12 bg-white">
        <div
          className="rounded-lg shadow-lg overflow-hidden"
          style={{ width: "666px", height: "488px" }}
        >
          <img
            src={service.thumbnail}
            alt={service.title}
            className="w-full h-full object-contain"
          />
        </div>
        <div
          className="border-2 border-yellow-400 rounded-lg p-6 shadow-md flex flex-col justify-between"
          style={{ width: "344px", height: "492px" }}
        >
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{service.title}</h2>
            <p className="text-sm text-gray-500 uppercase">Starting at</p>
            <p className="text-2xl font-semibold text-orange-600">
              ₹{service.price}
            </p>
            <ServiceWishlistButton serviceId={id} />
            <button className="bg-yellow-400 hover:bg-yellow-500 transition text-white w-full py-2 rounded font-semibold">
              Add to cart
            </button>
            <div className="text-sm text-gray-700">
              <p><span className="font-bold">938</span> Reviews</p>
              <p>⭐ <span className="font-bold">{service.rating || 4.7}</span></p>
            </div>
            <div className="border border-yellow-400 text-yellow-700 p-3 rounded bg-yellow-50 text-sm">
              <p className="font-bold">🎉 Sale Is On!</p>
              <p>Look for the coupon code at the top of the screen.</p>
            </div>
          </div>
          <div className="pt-4 text-gray-500 text-xs space-y-1">
            <p>💡 30-day money-back guarantee</p>
            <p>🌐 Unlimited access, anywhere, anytime</p>
          </div>
        </div>
        <div
          className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm"
          style={{ width: "344px", height: "492px" }}
        >
          <h3 className="text-xl font-semibold mb-4">Includes</h3>
          <ul className="space-y-3 text-base text-gray-800">
            {service.includes.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex justify-center mt-20">
        <div className="rounded-lg overflow-hidden shadow-lg" style={{width: "826.67px", height: "465px"}}>
          <iframe
            width="100%"
            height="100%"
            src={service.videoUrl}
            title={service.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full rounded-lg"
          ></iframe>
        </div>
      </div>
      <div className="p-10">
        <PricingCards packages={service.packages} serviceId={id} />
      </div>
      <div className="py-12">
        <h1 className="flex justify-center font-bold text-4xl text-[#333333] font-inter">
          Trusted by 600+ clients
        </h1>
        {/* <TrustedByLogos /> */}
      </div>
      <WhyChooseUs />
      <div className="bg-gray-50 py-12 px-6 md:px-20">
        <h2 className="text-[28px] leading-[36px] font-normal text-[#333333] font-[Quicksand] mb-6">
          What We Will Do
        </h2>
        <ul className="list-disc pl-6 space-y-4">
          {service.description.map((point, index) => (
            <li key={index} className="text-[28px] leading-[36px] font-normal text-[#333333] font-[Quicksand]">
              {point}
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white py-20 px-6 md:px-20">
        <h2 className="text-center text-[28px] leading-[36px] font-normal text-[#333333] font-[Quicksand] mb-10">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
          {service.faqs.map((faq, index) => (
            <AccordionItem value={`faq-${index}`} key={index}>
              <AccordionTrigger className="text-left text-lg font-medium text-[#333333] font-[Quicksand]">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-base text-gray-600 font-[Quicksand]">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <AllServiceExcept id={id} />
    </div>
  );
}