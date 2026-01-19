import { Suspense } from "react";
import CategoryClient from "./CategoryClient";
import { categoryItems } from "../categoryData";

// Cities that can be accessed via category route - 58 Algerian Wilayas
const cityCategories = [
  'adrar', 'chlef', 'laghouat', 'oum-el-bouaghi', 'batna', 'bejaia', 'biskra', 'bechar',
  'blida', 'bouira', 'tamanrasset', 'tebessa', 'tlemcen', 'tiaret', 'tizi-ouzou', 'alger',
  'djelfa', 'jijel', 'setif', 'saida', 'skikda', 'sidi-bel-abbes', 'annaba', 'guelma',
  'constantine', 'medea', 'mostaganem', 'msila', 'mascara', 'ouargla', 'oran', 'el-bayadh',
  'illizi', 'bordj-bou-arreridj', 'boumerdes', 'el-tarf', 'tindouf', 'tissemsilt', 'el-oued',
  'khenchela', 'souk-ahras', 'tipaza', 'mila', 'ain-defla', 'naama', 'ain-temouchent',
  'ghardaia', 'relizane', 'timimoun', 'bordj-badji-mokhtar', 'ouled-djellal', 'beni-abbes',
  'in-salah', 'in-guezzam', 'touggourt', 'djanet', 'el-mghair', 'el-meniaa'
];

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