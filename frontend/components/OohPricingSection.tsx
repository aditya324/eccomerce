import { Check } from "lucide-react";
import ServiceSubscribeButton from "./ServiceSubscribeButton";

type OOHPackage = {
  _id: string;
  title: string;
  price: number;
  billingCycle: string;
  features: string[];
  subType: string;
};

interface Props {
  serviceId: string;
  packages: OOHPackage[];
  selectedSubType: string;
}

export default function OohPricingSection({
  serviceId,
  packages,
  selectedSubType,
}: Props) {
  const filteredPackages = packages.filter(
    (pkg) => pkg.subType === selectedSubType
  );

  return (
    <section
      className="py-20 px-6"
      style={{
        background:
          "linear-gradient(180deg, rgba(255, 190, 91, 0) 34.13%, rgba(242, 177, 4, 0.35) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4">Choose Your OOH Package</h2>
        <p className="text-gray-700 mb-12 text-lg">
          Explore pricing based on selected format:{" "}
          <span className="font-semibold capitalize text-yellow-800">
            {selectedSubType}
          </span>
        </p>

        {filteredPackages.length === 0 ? (
          <p className="text-lg text-gray-500">No packages available for this format.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {filteredPackages.map((pkg, index) => (
              <div
                key={pkg._id}
                className={`flex flex-col justify-between rounded-2xl border p-10 shadow-md transition hover:shadow-xl bg-white w-[360px] ${
                  index === 1 ? "border-yellow-400 scale-[1.02]" : "border-gray-200"
                }`}
              >
                {index === 1 && (
                  <div className="mb-3">
                    <span className="text-sm font-semibold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-2xl font-semibold mb-2">{pkg.title}</h3>
                <p className="text-gray-500 mb-6 capitalize">{pkg.billingCycle} billing</p>

                <div className="text-4xl font-bold mb-6">₹{pkg.price.toLocaleString()}</div>

                <ul className="space-y-4 mb-8 text-left">
                  {pkg.features.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-base text-gray-700 leading-snug"
                    >
                      <Check className="text-green-500 mt-1" size={20} />
                      {f}
                    </li>
                  ))}
                </ul>

                <ServiceSubscribeButton
                  serviceId={serviceId}
                  pkgId={pkg._id}
                  label="Get Started"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
