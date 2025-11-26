import { Suspense } from "react";
import CategoryClient from "./CategoryClient";
import { categoryItems } from "../categoryData";

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
  return Object.keys(categoryItems).map((category) => ({
    category,
  }));
}