"use client";

import { useOoh } from "@/hooks/useService";
import { Service } from "@/types/Ooh";
import OohServiceCard from "@/components/OohServiceCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function AllService() {
  const { data, isLoading, isError } = useOoh();

  if (isLoading) return <div className="px-6 py-8">Loading...</div>;
  if (isError || !data) return <div className="px-6 py-8">Failed to load services.</div>;

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
    <div className="px-4 py-8">
      <h2 className="text-xl lg:ml-5 font-semibold mb-4 flex items-center gap-2">
        Continue browsing <span className="text-2xl">→</span>
      </h2>

      <Slider {...settings}>
        {data.map((service: Service) => (
          <div key={service._id} className="px-5">
            <OohServiceCard service={service} />
          </div>
        ))}
      </Slider>
    </div>
  );
}
