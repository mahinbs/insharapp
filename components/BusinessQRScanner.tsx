'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface BusinessQRScannerProps {
  onScanSuccess: (qrData: string) => void;
  onClose: () => void;
}

/**
 * Business scans the influencer's check-in QR code (raw qr_data string).
 */
export default function BusinessQRScanner({ onScanSuccess, onClose }: BusinessQRScannerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    checkCameraPermission();
    return () => {
      stopScanner();
    };
  }, []);

  const checkCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setHasPermission(true);
    } catch (err) {
      setHasPermission(false);
      setError('Camera permission denied. Please enable camera access.');
    }
  };

  const startScanner = async () => {
    if (!hasPermission) {
      setError('Camera permission is required');
      return;
    }
    try {
      const html5QrCode = new Html5Qrcode('business-qr-reader');
      scannerRef.current = html5QrCode;
      await html5QrCode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          if (decodedText && decodedText.startsWith('inshaar-')) {
            stopScanner();
            onScanSuccess(decodedText);
          } else {
            setError('Invalid QR code. Please scan the influencer\'s check-in QR.');
          }
        },
        () => {}
      );
      setIsScanning(true);
      setError(null);
    } catch (err: any) {
      setError('Failed to start camera. Please try again.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {}
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scan influencer QR</h2>
          <button
            onClick={() => { stopScanner(); onClose(); }}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"
          >
            <i className="ri-close-line text-white text-xl"></i>
          </button>
        </div>
        <div className="p-6">
          {hasPermission === false ? (
            <div className="text-center py-12">
              <i className="ri-camera-off-line text-6xl text-gray-300 mb-4"></i>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button
                onClick={checkCameraPermission}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold"
              >
                Check again
              </button>
            </div>
          ) : (
            <>
              <div className="relative bg-black rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '1' }}>
                <div id="business-qr-reader" className="w-full h-full"></div>
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <button
                      onClick={startScanner}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold"
                    >
                      Start scanner
                    </button>
                  </div>
                )}
              </div>
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
                  {error}
                </div>
              )}
              <p className="text-sm text-gray-600 text-center">
                Ask the influencer to show their check-in QR code from the app, then scan it here.
              </p>
              {isScanning && (
                <button
                  onClick={stopScanner}
                  className="mt-4 w-full py-3 bg-gray-100 rounded-xl font-semibold"
                >
                  Stop scanner
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
