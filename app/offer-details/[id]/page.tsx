
import OfferDetailsClient from './OfferDetailsClient';

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

export default function OfferDetailsPage({ params }: { params: { id: string } }) {
  return <OfferDetailsClient offerId={params.id} />;
}
