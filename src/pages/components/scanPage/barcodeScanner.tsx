import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';

type verifiedTicketsData = {
  slug: string;
  email: string;
  ticketKind: string;
  birthDay: String;
  gender: string;
  phoneNumber: string;
  instaUserName: string;
  fullName: string;
  verified: boolean;
  rejected: boolean;
  qrCode: string;
  nationalId: string;
  scanned: boolean;
}[] | undefined

function MyQRScannerComponent({refetch} : {refetch: <TPageData>(
  options?: RefetchOptions & RefetchQueryFilters<TPageData>,
) => Promise<QueryObserverResult<verifiedTicketsData, unknown>>}) {

  const [slug, setSlug] = useState("")
  const qrReaderRef = useRef<HTMLDivElement | null>(null);
  let qrCodeScanner: Html5Qrcode | null = null;
  const {mutateAsync: boughtTicketsMutate} = api.boughtTickets.updateScannedOfOneBySlug.useMutation()
  const {mutateAsync: eventsMutate} = api.events.updateNumberOfScannedTicketsOfOneByName.useMutation()
  const {refetch: boughtTicketRefetch} = api.boughtTickets.getOneBySlug.useQuery({slug: slug}, {refetchOnMount: false, refetchOnWindowFocus: false})

  const onScanSuccess = (decodedText: string) => {

    qrCodeScanner?.pause()
    const slugIndex = decodedText.indexOf("_");
    setSlug(decodedText.substr(slugIndex as number + 1))
    if(slug !== ""){
    boughtTicketRefetch()
      .then((res) => {
        if(!res.data?.scanned){
          boughtTicketsMutate({slug: slug})
            .then((res) => {
              eventsMutate({eventName: res?.event.eventName, scannedTicketsNumber: res?.event.scannedTicketsNumber})
                .then((res) => {
                  refetch()
                })
          })
          .catch(err => {
            throw new Error(`Message: ${err.message}`)
          }) 
      }

    })
  }
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
      if (qrCodeScanner?.isScanning) {
          qrCodeScanner.stop()
      }
    };
  }, [slug]);

  return (
    <div>
      {/* Element where the camera feed will be rendered */}
      <div ref={qrReaderRef} id="qr-reader" style={{ width: '100%'}}></div>
    </div>
  );
}

export default MyQRScannerComponent;
