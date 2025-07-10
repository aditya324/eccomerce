"use client";

import { Service } from "@/types/service";
import ServiceCard from "@/components/ServiceCard";
import Slider from "react-slick";
import { useCategoryBySlug } from "@/hooks/useCategories";

export default function DevelopMent() {
  const {
    data,
    isLoading,
    isError: error,
  } = useCategoryBySlug("test-category");

  console.log("data", data);

  if (isLoading) return <div className="px-6 py-8">Loading...</div>;
  if (error) return <p>Error loading category</p>;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="px-4 py-8">
      <h2 className="text-xl lg:ml-5 font-semibold mb-4 flex items-center gap-2">
        Marketing & Branding (DOOH) <span className="text-2xl">→</span>
      </h2>

      <Slider {...settings}>
        {data.services.map((service: Service) => (
          <div key={service._id} className="px-5">
            <ServiceCard service={service} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
