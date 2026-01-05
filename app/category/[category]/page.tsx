import { Suspense } from "react";
import CategoryClient from "./CategoryClient";
import { categoryItems } from "../categoryData";

// Cities that can be accessed via category route
const cityCategories = ['paris', 'london', 'marseille', 'new york'];

// In Next.js 15+, params are now async
export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CategoryClient category={resolvedParams.category} />
    </Suspense>
  );
}

export function generateStaticParams() {
  // Generate params for both category items and cities
  const categoryParams = Object.keys(categoryItems).map((category) => ({
    category,
  }));
  
  const cityParams = cityCategories.map((city) => ({
    category: city,
  }));
  
  return [...categoryParams, ...cityParams];
}