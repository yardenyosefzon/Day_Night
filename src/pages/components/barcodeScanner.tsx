import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

function MyQRScannerComponent() {
  const qrReaderRef = useRef<HTMLDivElement | null>(null);
  let qrCodeScanner: Html5Qrcode | null = null;

  const onScanSuccess = (decodedText: string, decodedResult: unknown) => {
    // handle the scanned code as you like, for example:
    console.log(`Code matched = ${decodedText}`, decodedResult);
  };
  
  const onScanFailure = (error: any) => {
    // handle scan failure, usually better to ignore and keep scanning.
    // for example:
    console.warn(`Code scan error = ${error}`);
  };

  const initializeScanner = () => {
    try {
    
      const qrReaderElement = qrReaderRef.current;

      if (!qrReaderElement) {
        console.error('QR reader element not found.');
        return;
      }

      const qrReaderId = qrReaderElement.id;

      qrCodeScanner = new Html5Qrcode(
        qrReaderId,
      );
//@ts-ignore
      qrCodeScanner.start({facingMode: "environment"}, {qrbox:500 ,fps: 10, disableFlip: true}, onScanSuccess);
      
    } catch (error) {
      console.error('Error initializing QR scanner:', error);
    }
  };

  useEffect(() => {

    if(!qrCodeScanner?.getState()){
      initializeScanner();
    }

    // Cleanup function to stop scanning when the component unmounts
    return () => {
      if (qrCodeScanner) {
        qrCodeScanner.clear();
      }
    };
  }, []);

  return (
    <div>
      {/* Element where the camera feed will be rendered */}
      <div ref={qrReaderRef} id="qr-reader" style={{ width: '100%'}}></div>
    </div>
  );
}

export default MyQRScannerComponent;
