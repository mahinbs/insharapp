'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface InfluencerQRCodeProps {
  collaborationId: string;
  businessName?: string;
  title?: string;
}

export default function InfluencerQRCode({
  collaborationId,
  businessName = 'Business',
  title = 'Your check-in QR code',
}: InfluencerQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/collaboration-qr?collaborationId=${encodeURIComponent(collaborationId)}`);
        if (!res.ok) {
          const j = await res.json().catch(() => ({}));
          throw new Error(j.error || 'Could not load QR code');
        }
        const { qr_data } = await res.json();
        if (cancelled) return;

        const dataUrl = await QRCode.toDataURL(qr_data, {
          width: 280,
          margin: 2,
          color: { dark: '#000000', light: '#FFFFFF' },
        });
        if (cancelled) return;
        setQrDataUrl(dataUrl);
      } catch (e: any) {
        if (!cancelled) setError(e.message || 'Failed to load QR code');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [collaborationId]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-8">
          <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm mt-3">Loading QR code...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <h4 className="font-semibold text-gray-800 mb-2">{title}</h4>
      <p className="text-gray-600 text-sm mb-4">
        Show this QR code when you arrive at {businessName}. The business will scan it to check you in.
      </p>
      <div className="flex flex-col items-center bg-gray-50 rounded-xl p-4">
        {qrDataUrl && (
          <img src={qrDataUrl} alt="Check-in QR code" className="w-56 h-56 rounded-lg" />
        )}
      </div>
    </div>
  );
}
