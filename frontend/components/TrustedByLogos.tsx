"use client";

import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const logos = [
  "/logos/adarsh.png",
  "/logos/aradhana.jpg",
  "/logos/chetana.jpg",
  "/logos/dheemahi.jpg",
  "/logos/girani.jpg",
  "/logos/janani.jpg",
  "/logos/kidzee.jpg",
  "/logos/maxx.jpg",
  "/logos/metro.jpg",
  "/logos/nano.jpg",
  "/logos/newlogo.png",
  "/logos/oneclicklogo.jpg",
  "/logos/totalsolution.jpg",
  "/logos/truscan.jpg",
];

export default function TrustedByLogos() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 9,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className=" mx-auto px-6 mt-10 overflow-x-hidden">
      <Slider {...settings}>
        {logos.map((logo, index) => (
          <div key={index} className="flex justify-center items-center">
            <Image
              src={logo}
              alt={`Logo ${index}`}
              width={120}
              height={60}
              className="object-contain transition duration-300"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
}
