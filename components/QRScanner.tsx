'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

interface QRScannerProps {
  collaborationId: string;
  businessId: string;
  scheduledTime?: string; // ISO string
  onScanSuccess: (data: {
    businessId: string;
    arrivalTime: string;
    isOnTime: boolean;
  }) => void;
  onClose: () => void;
}

export default function QRScanner({
  collaborationId,
  businessId,
  scheduledTime,
  onScanSuccess,
  onClose
}: QRScannerProps) {
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
      setError('Camera permission denied. Please enable camera access in your browser settings.');
    }
  };

  const startScanner = async () => {
    if (!hasPermission) {
      setError('Camera permission is required to scan QR codes');
      return;
    }

    try {
      const html5QrCode = new Html5Qrcode('qr-reader');
      scannerRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText, decodedResult) => {
          handleQRCodeScanned(decodedText);
        },
        (errorMessage) => {
          // Ignore scanning errors (they're frequent while scanning)
        }
      );

      setIsScanning(true);
      setError(null);
    } catch (err: any) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please try again.');
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        await scannerRef.current.clear();
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
      scannerRef.current = null;
    }
    setIsScanning(false);
  };

  const handleQRCodeScanned = (decodedText: string) => {
    try {
      const qrData = JSON.parse(decodedText);
      
      // Validate QR code structure
      if (!qrData.businessId || qrData.type !== 'collaboration-checkin') {
        setError('Invalid QR code. Please scan the correct business QR code.');
        return;
      }

      // Validate business ID matches
      if (qrData.businessId !== businessId) {
        setError('This QR code is for a different business. Please scan the correct QR code.');
        return;
      }

      // Calculate if on-time (within 15 minutes before to 1 hour after scheduled time)
      const arrivalTime = new Date();
      let isOnTime = true;

      if (scheduledTime) {
        const scheduled = new Date(scheduledTime);
        const timeDiff = arrivalTime.getTime() - scheduled.getTime();
        const minutesDiff = timeDiff / (1000 * 60);
        
        // On-time if between 15 minutes before and 60 minutes after
        isOnTime = minutesDiff >= -15 && minutesDiff <= 60;
      }

      // Stop scanner and call success callback
      stopScanner();
      onScanSuccess({
        businessId: qrData.businessId,
        arrivalTime: arrivalTime.toISOString(),
        isOnTime
      });
    } catch (err) {
      setError('Invalid QR code format. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
          <button
            onClick={() => {
              stopScanner();
              onClose();
            }}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <i className="ri-close-line text-white text-xl"></i>
          </button>
        </div>

        {/* Scanner Area */}
        <div className="p-6">
          {hasPermission === false ? (
            <div className="text-center py-12">
              <i className="ri-camera-off-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Camera Permission Required</h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button
                onClick={checkCameraPermission}
                className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold"
              >
                Check Again
              </button>
            </div>
          ) : (
            <>
              <div className="relative bg-black rounded-2xl overflow-hidden mb-4" style={{ aspectRatio: '1' }}>
                <div id="qr-reader" className="w-full h-full"></div>
                {!isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <button
                      onClick={startScanner}
                      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                    >
                      Start Scanner
                    </button>
                  </div>
                )}
                {isScanning && (
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-white rounded-xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-pink-500 rounded-tl-xl"></div>
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-pink-500 rounded-tr-xl"></div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-pink-500 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-pink-500 rounded-br-xl"></div>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start space-x-2">
                    <i className="ri-error-warning-line text-red-500 text-lg"></i>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-sm text-blue-800 text-center">
                  <i className="ri-information-line mr-2"></i>
                  Point your camera at the business QR code to check in
                </p>
              </div>

              {isScanning && (
                <button
                  onClick={stopScanner}
                  className="mt-4 w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Stop Scanner
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

