import React from "react";

import { Zap, Tag, Package, Truck } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<Feature> = ({ icon, title, description }) => (
  <div className="w-full bg-white rounded-lg shadow-sm p-4 border border-gray-200">
    <div className="pt-2 md:pt-6 ">
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg">{icon}</div>
          <h3 className="text-lg md:text-xl font-semibold">{title}</h3>
        </div>
        <p className="text-gray-600 text-sm md:text-base">{description}</p>
      </div>
    </div>
  </div>
);

const FeaturesSection = () => {
  const features: Feature[] = [
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Lightning Fast Search",
      description:
        "Instantly search across multiple retailers. No more switching between slow websites to find the components you need for your project.",
    },
    {
      icon: <Tag className="w-6 h-6 text-green-500" />,
      title: "True Price Comparison",
      description:
        "See final prices including GST and shipping fees. Easily spot the best deals with transparent pricing and free shipping thresholds.",
    },
    {
      icon: <Package className="w-6 h-6 text-blue-500" />,
      title: "Real-time Stock Status",
      description:
        "Check component availability across Robu, Quartz Components, RoboKits, Sunrom, Evelta, and more. Know exactly how many units are in stock.",
    },
    {
      icon: <Truck className="w-6 h-6 text-purple-500" />,
      title: "Shipping Information",
      description:
        "View COD availability and free shipping thresholds for each retailer. Make informed decisions about your purchase with complete shipping details.",
    },
  ];

  return (
    <div className="max-w-full  mx-auto px-4 py-4 md:px-32 md:py-10 border-t border-gray-200">
      <p className="text-gray-600 text-sm md:text-base text-center mb-4 md:mb-8">
        Ultra-fast search engine to instantly find electronic components,
        compare prices, and check real-time stock, GST-inclusive pricing, and
        shipping details from popular Indian Component Distributors—all in one
        place!
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;
