"use client";

import { useServiceExcept } from "@/hooks/useService";
import { Service } from "@/types/service";
import ServiceCard from "./ServiceCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

interface AllServiceExceptProps {
  id: string;
}

export default function AllServiceExcept({ id }: AllServiceExceptProps) {
  const { data, isLoading, isError } = useServiceExcept(id);


  console.log(data, "serviceexcept")

  if (isLoading) return <div className="px-6 py-8">Loading...</div>;
  if (isError || !data || !data.service)
    return <div className="px-6 py-8">Failed to load services.</div>;

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    swipeToSlide: true,
    arrows: true,
    responsive: [
      { breakpoint: 1586, settings: { slidesToShow: 5 } },
      { breakpoint: 1500, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="px-4 py-8 bg-[radial-gradient(circle,_rgba(242,177,4,0.14)_0%,_rgba(242,177,4,0)_100%)] ">
      <h2 className="text-xl lg:ml-5 font-semibold mb-4 flex items-center gap-2">
        Continue browsing <span className="text-2xl">→</span>
      </h2>

      <Slider {...settings}>
        {data.service.map((service: Service) => (
          <div key={service._id} className="px-5">
            <ServiceCard service={service} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
