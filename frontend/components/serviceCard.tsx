"use client"
import { Service } from "@/types/service";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  service: Service;
}

export default function ServiceCard({ service }: Props) {
  const router = useRouter();
  return (
    <div
      className="
        w-[300px] sm:w-[260px] md:w-[280px] lg:w-[300px] 
        h-[300px] sm:h-[280px] md:h-[290px] lg:h-[300px]
        bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden
      "
      onClick={() => router.push(`/service/${service._id}`)}
    >
      <div className="relative w-full h-[160px]">
        <Image
          src="/images/dummyimage.png"
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between h-[calc(100%-160px)]">
        <h3 className="text-center text-sm font-medium">{service.title}</h3>

        <div className="mt-auto border-t pt-2 flex justify-between items-center text-sm text-gray-600">
          <div className="text-xl">♡</div>
          <div className="text-right">
            <p className="text-xs text-gray-400">STARTING AT</p>
            <p className="font-semibold text-black text-sm">
              ₹{service.packages?.[0]?.price ?? service.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
