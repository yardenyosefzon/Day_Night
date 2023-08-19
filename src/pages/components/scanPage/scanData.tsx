import { useRouter } from 'next/router'
import React, {useEffect, useState} from 'react'
import { Noto_Sans_Hebrew } from 'next/font/google'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'

const noto = Noto_Sans_Hebrew({subsets: ['hebrew'], weight:'400'})

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
  age: number;
}[] | undefined

function ScanData({scannedTicketsNumber, verifiedTicketsData} : {scannedTicketsNumber: number, verifiedTicketsData: verifiedTicketsData}) {

  const {query: {eventName}} = useRouter()
  const [lastScanned, setLastScanned] = useState("")
  const [showInfo, setShowInfo] = useState(false)
  const [ticketKind, setTicketKind] = useState('scannedVerifiedTickets')
  const [verfiedTickets, setVerfiedTickets] = useState<verifiedTicketsData>()
  const [scannedVerifiedTickets, setScannedVerfiedTickets] = useState<verifiedTicketsData>()
  useEffect(() => {
    const verifiedTickets = verifiedTicketsData?.filter( ticket => ticket.scanned === false)
    const scannedVerifiedTickets = verifiedTicketsData?.filter( ticket => ticket.scanned === true)
    setVerfiedTickets(() => verifiedTickets)
    setScannedVerfiedTickets(() => scannedVerifiedTickets)
  }, [])
  
  return (
    <div className={`sticky flex flex-col-reverse items-center w-screen h-fit bottom-0 ${noto.className}`}>
            <div className='flex flex-row-reverse justify-between w-full p-2 bg-gradient-to-t from-orange-100 to-orange-50'>
                <div className='flex flex-col items-center w-1/3'>
                  <p>{scannedTicketsNumber}</p>
                  <p className='font-semibold'>סרוקים</p>
                </div>
                <div className='flex flex-col items-center w-1/3'>
                  <p>{verifiedTicketsData?.length}</p>
                  <p className='font-semibold'>סה"כ</p>
                </div>
                <div className='flex flex-col items-center w-1/3'>
                  {scannedVerifiedTickets && lastScanned === "" ? scannedVerifiedTickets[scannedVerifiedTickets.length - 1]?.fullName : lastScanned}
                </div>
            </div>
            <div className={`flex w-full justify-center p-1 bg-gradient-to-b from-orange-50 via-yellow-50 to-orange-50 ${!showInfo && 'rounded-t-3xl'}`}>
              <FontAwesomeIcon icon={showInfo ? faChevronDown : faChevronUp} onClick={() => setShowInfo(bool => !bool)} className='text-xs p-7 -m-7'/>
            </div>
              <div className={`flex flex-col ${!showInfo ? 'h-0' : 'h-60'} transition-all`}>
              {
                showInfo &&
                  <div className='flex flex-col items-center w-screen h-full bg-gradient-to-b from-orange-100 to-orange-50 rounded-t-3xl p-2'>
                    <div className='flex w-full justify-center border-b-2 border-black mb-3'>
                      <button onClick={() => setTicketKind('verifiedTickets')} className={`w-1/2 rounded-t-3xl py-3 ${ticketKind === 'verifiedTickets' && 'font-bold bg-gradient-to-bl from-orange-100 to-yellow-50'}`}>פירוט ממתינים</button>
                      <button onClick={() => setTicketKind('scannedVerifiedTickets')} className={`w-1/2 py-3 rounded-t-3xl ${ticketKind !== 'verifiedTickets' && 'font-bold bg-gradient-to-br from-orange-100 to-yellow-50'}`}>פירוט סרוקים</button>
                    </div>
                    {ticketKind === 'verifiedTickets' ?
                    verfiedTickets?.length === 0 ?
                      <p>אין כאן כרטיסים</p>
                    :
                    <div className='w-full overflow-auto'>
                      <div className='flex flex-row-reverse w-full text-center mb-2'>
                        <p className='w-1/3 font-bold'>שם</p>
                        <p className='w-1/3 font-bold'>ת.ז</p>
                        <p className='w-1/6 font-bold'>כרטיס</p>
                        <p className='w-1/6 font-bold'>גיל</p>
                      </div>
                      {
                      verfiedTickets?.map(ticket => 
                        <div className='flex flex-row-reverse w-full text-center border-y-2 border-white py-2'>
                          <div className='flex justify-center items-center w-1/3'>
                            <p>
                              {ticket.fullName}
                            </p>
                          </div>
                          <div className='flex justify-center items-center w-1/3'>
                            <p>
                              {ticket.nationalId}
                            </p>
                          </div>
                          <div className='w-1/6 text-sm'>
                            {ticket.ticketKind}
                          </div>
                          <div className='w-1/6'>
                            {ticket.age}
                          </div>
                        </div>
                        )}
                    </div>
                    :
                    scannedVerifiedTickets?.length === 0 ?
                      <p>אין כאן כרטיסים</p>
                    :
                    <div className='w-full overflow-auto'>
                      <div className='flex flex-row-reverse w-full text-center mb-2'>
                        <p className='w-1/3 font-bold'>שם</p>
                        <p className='w-1/3 font-bold'>ת.ז</p>
                        <p className='w-1/6 font-bold'>כרטיס</p>
                        <p className='w-1/6 font-bold'>גיל</p>
                      </div>
                      {
                      scannedVerifiedTickets?.map(ticket => 
                        <div className='flex flex-row-reverse w-full text-center border-y-2 border-white py-2'>
                          <div className='flex justify-center items-center w-1/3'>
                            <p>
                              {ticket.fullName}
                            </p>
                          </div>
                          <div className='flex justify-center items-center w-1/3'>
                            <p>
                              {ticket.nationalId}
                            </p>
                          </div>
                          <div className='w-1/6 text-sm'>
                            {ticket.ticketKind}
                          </div>
                          <div className='w-1/6'>
                            {ticket.age}
                          </div>
                        </div>
                        )}
                    </div>
                    }
                  </div>
              }
              </div>
    </div>
  )
}

export default ScanData