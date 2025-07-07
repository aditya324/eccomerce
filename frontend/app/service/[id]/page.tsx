// app/service/[id]/page.tsx

export const dynamic = "force-dynamic"; // 👈 ADD THIS LINE

import axios from "axios";
import { notFound } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

interface Service {
  _id: string;
  title: string;
  slug: string;
  price: number;
  thumbnail: string;
  description?: string;
}

export default async function ServicePage({ params }: Props) {
  const id = params.id;

  try {
    const res = await axios.get(`http://localhost:5000/api/service/${id}`);
    const service: Service = res.data;

    if (!service) return notFound();

    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">{service.title}</h1>
        <div className="flex gap-6">
          
          <div>
            <p className="text-lg text-gray-700 mb-2">Price: ₹{service.price}</p>
            {service.description && (
              <p className="text-gray-600">{service.description}</p>
            )}
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Error fetching service:", error);
    return notFound();
  }
}
