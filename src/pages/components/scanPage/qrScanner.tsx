import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/router';
import { api } from '~/utils/api';
import { QueryObserverResult, RefetchOptions, RefetchQueryFilters } from '@tanstack/react-query';
import type { Event } from '~/pages/myEvents/[eventName]/scan';
import Spinner from '../spinner';

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

type QRScannerComponentProps = {
  event: Event
  isLoading: boolean;
  manyBoughtTicketsRefetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
    ) => Promise<QueryObserverResult<verifiedTicketsData, unknown>>
  eventsRefetch:  <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>,
    ) => Promise<QueryObserverResult<{
      eventName: string;
      slug: string;
      scannedTicketsNumber: number;
      eventCreator: {
          hideQrEx: boolean;
      };
  }[] | undefined, unknown>>

}

function QRScanner({event, isLoading, manyBoughtTicketsRefetch, eventsRefetch} : QRScannerComponentProps) {

  const [slug, setSlug] = useState("")
  const qrReaderRef = useRef<HTMLDivElement | null>(null);
  let qrCodeScanner: Html5Qrcode | null = null;
  const {mutateAsync: boughtTicketsMutate, isLoading: boughtTicketMutateLoading} = api.boughtTickets.updateScannedOfOneBySlug.useMutation()
  const {mutateAsync: eventsMutate, isLoading: eventsMutateLoadnig} = api.events.updateNumberOfScannedTicketsOfOneByName.useMutation()
  const {refetch: boughtTicketRefetch, isLoading: boughtTicketLoading} = api.boughtTickets.getOneBySlug.useQuery({slug: slug}, {refetchOnMount: false, refetchOnWindowFocus: false, })

  const onScanSuccess = (decodedText: string) => {
   
    const slug = decodedText.split("_")[1]?.trimStart();
    setSlug(() => slug as string)
    
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

    if(slug !== ""){
      boughtTicketRefetch()
      .then((res) => {
        console.log(res)
        if(!res.data?.scanned){
            boughtTicketsMutate({slug: slug})
            eventsMutate({eventName: event?.eventName, scannedTicketsNumber: event?.scannedTicketsNumber})
            .then((res) => { 
              manyBoughtTicketsRefetch()
              eventsRefetch()
              console.log(qrCodeScanner)
          })
            .catch(err => {
              throw new Error(`Message: ${err.message}`)
            }) 
        }
        else 
        console.log(qrCodeScanner)
      })
    }
    
  }, [slug])
  
  useEffect(() => {

    if(!qrCodeScanner){
      initializeScanner();
    }

    // Cleanup function to stop scanning when the component unmounts
    return () => {
      if (qrCodeScanner?.isScanning) {
        console.log('here')
          qrCodeScanner.stop()
      }
    };
  }, []);

  // console.log(boughtTicketMutateLoading || eventsMutateLoadnig || boughtTicketLoading || isLoading)
  return (
    <div>
      {/* Element where the camera feed will be rendered */}
      <div className='z-0' ref={qrReaderRef} id="qr-reader" style={{ width: '100%'}}></div>
    </div>
  );
}

export default QRScanner;
