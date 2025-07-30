"use client"
import { OOHService } from "@/types/service";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  service: OOHService;
}

export default function OohServiceCard({ service }: Props) {
  const router = useRouter();
  return (
    <div
      className="
        w-[318px] 
        h-[433px]
        bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden cursor-pointer
      "
      onClick={() => router.push(`/ooh-service/${service._id}`)}
    >
      <div className="relative w-full h-[281px] ">
        <Image
          src="/images/dummyimage.png"
          alt={service.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4 flex flex-col justify-between lg:h-[calc(100%-281px)]">
        <h3 className="text-center text-xl font-medium">{service.title}</h3>

        <div className=" border-t pt-2 flex justify-between items-center text-sm text-gray-600">
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
