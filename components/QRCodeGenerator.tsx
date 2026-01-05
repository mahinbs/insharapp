'use client';

import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeGeneratorProps {
  businessId: string;
  businessName: string;
  onQRGenerated?: (qrDataUrl: string) => void;
}

export default function QRCodeGenerator({ 
  businessId, 
  businessName,
  onQRGenerated 
}: QRCodeGeneratorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    generateQRCode();
  }, [businessId]);

  const generateQRCode = async () => {
    if (!canvasRef.current) return;
    
    setIsGenerating(true);
    try {
      // QR code data structure: JSON with businessId and timestamp for validation
      const qrData = JSON.stringify({
        businessId,
        type: 'collaboration-checkin',
        timestamp: Date.now()
      });

      const dataUrl = await QRCode.toDataURL(canvasRef.current, qrData, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });

      setQrDataUrl(dataUrl);
      onQRGenerated?.(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQR = () => {
    if (!qrDataUrl) return;
    
    const link = document.createElement('a');
    link.download = `${businessName}-QR-Code.png`;
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Business QR Code</h3>
          <p className="text-sm text-gray-500 mt-1">Display this at your location</p>
        </div>
        <button
          onClick={downloadQR}
          disabled={!qrDataUrl || isGenerating}
          className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          <i className="ri-download-line"></i>
          <span>Download</span>
        </button>
      </div>

      <div className="flex flex-col items-center justify-center bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-200">
        {isGenerating ? (
          <div className="flex flex-col items-center space-y-3">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-sm">Generating QR Code...</p>
          </div>
        ) : (
          <>
            <canvas ref={canvasRef} className="hidden" />
            {qrDataUrl && (
              <>
                <img 
                  src={qrDataUrl} 
                  alt="QR Code" 
                  className="w-64 h-64 rounded-xl shadow-lg mb-4"
                />
                <p className="text-xs text-gray-500 text-center max-w-xs">
                  Collaborators will scan this code when they arrive at your location
                </p>
              </>
            )}
          </>
        )}
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-2">
          <i className="ri-information-line text-blue-500 text-lg mt-0.5"></i>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How it works:</p>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              <li>Print or display this QR code at your business entrance</li>
              <li>Collaborators scan it when they arrive</li>
              <li>Arrival time is automatically recorded</li>
              <li>You'll see visit confirmations in your Agenda</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

