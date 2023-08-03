import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/router';

function MyQRScannerComponent() {
  const { replace } = useRouter()
  const qrReaderRef = useRef<HTMLDivElement | null>(null);
  let qrCodeScanner: Html5Qrcode | null = null;

  const onScanSuccess = (decodedText: string, decodedResult: unknown) => {
    // handle the scanned code as you like, for example:
    alert(`Code matched = ${decodedText}`);
    console.log(decodedResult)
  
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
  const height = document.body.offsetHeight
  const width = document.body.offsetWidth
  const minWidth = Math.min(height, width)
  const config = { fps: 10, qrbox: { width: minWidth * 0.667, height: minWidth * 0.667 }, aspectRatio: Math.ceil(height / width) }
  //@ts-ignore
  qrCodeScanner.start({facingMode: 'environment'}, config, onScanSuccess)
      
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
