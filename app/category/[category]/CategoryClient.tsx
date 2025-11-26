"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AdvancedBottomNav from "../../../components/AdvancedBottomNav";
import {
  categoryItems,
  hasTypeKey,
  isCategoryKey,
} from "../categoryData";

interface CategoryClientProps {
  category: string;
}

export default function CategoryClient({ category }: CategoryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!category || !type) {
      setItems([]);
      return;
    }

    if (isCategoryKey(category)) {
      const categoryData = categoryItems[category];
      if (hasTypeKey(categoryData, type)) {
        setItems(categoryData[type]);
        return;
      }
    }

    setItems([]);
  }, [category, type]);

  const getCategoryIcon = (cat: string) => {
    const icons: { [key: string]: string } = {
      restaurant: "ri-restaurant-line",
      beauty: "ri-scissors-line",
      fashion: "ri-shirt-line",
      fitness: "ri-run-line",
      travel: "ri-plane-line",
    };
    return icons[cat] || "ri-apps-line";
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-20">
      <div className="bg-white shadow-sm">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <i className="ri-arrow-left-line text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-800 capitalize">
                {category} - {type ?? "all"}
              </h1>
              <p className="text-gray-500 text-sm">
                Explore {type ?? "all"} offers in {category}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-6">
        {items.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-xl"
              >
                <div className="relative h-48 sm:h-56">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="font-bold text-white text-lg sm:text-xl">
                      {item.businessName}
                    </h3>
                    <div className="flex items-center space-x-3 mt-1">
                      <div className="flex items-center space-x-1">
                        <i className="ri-star-fill text-yellow-400"></i>
                        <span className="text-white text-sm font-semibold">
                          {item.rating}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <i className="ri-user-line text-white/80"></i>
                        <span className="text-white/80 text-sm">
                          {item.applications} applied
                        </span>
                      </div>
                      <span className="text-white/80 text-sm">
                        • {item.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-6">
                  <h4 className="font-bold text-gray-800 text-lg sm:text-xl mb-2">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {item.description}
                  </p>

                  <Link href={`/offer-details/${item.id}`}>
                    <button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]">
                      View Offer Details
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className={`${getCategoryIcon(category)} text-gray-400 text-3xl`}></i>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No Offers Found
            </h3>
            <p className="text-gray-500 mb-6">
              There are no {type ?? "selected"} offers available in {category} right now.
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>

      <AdvancedBottomNav userType="influencer" />
    </div>
  );
}

