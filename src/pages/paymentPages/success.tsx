import { useRouter } from 'next/router';
import React, { useEffect, useState, useRef } from 'react'
import { api } from '~/utils/api';
import { useSession } from 'next-auth/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Noto_Sans_Hebrew } from 'next/font/google';
import Link from 'next/link';

const nont = Noto_Sans_Hebrew({subsets: ["hebrew"], weight:"400"})

type TicketArr = {
  birthDay: string;
  age: number;
  gender: string;
  phoneNumber: string;
  instaUserName: string;
  nationalId: string;
  email: string;
  fullName: string;
}[];

function Success({response}: {response: any}) {
  const {data: sessionData} = useSession()
  const {query: {number, amount, method, four_digits, number_of_payments, transaction_uid}} = useRouter()

  const shouldCreate = useRef(true)

  const { mutateAsync: createBoughtTickets } = api.boughtTickets.create.useMutation();
  const { mutate: changeNumberOfBoughtTickets } = api.schemaTickets.changeNumberOfBoughtTicketsOfOneByEventAndTicketName.useMutation()

  const [date, setDate] = useState(new Date(Date.now()))

    function hasPassedMoreThanTenSec(targetDateStr: string) {
      const targetDate = new Date(targetDateStr);
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - targetDate.getTime();
      console.log(timeDifference)
      const tenSecondsInMillis = 10000; 

      return timeDifference < tenSecondsInMillis;
    }

    useEffect(() => {
      let ticketArr : TicketArr = []
      //@ts-ignore
      const transactionDetails = response.transactions.filter( transaction => transaction.number === number )[0]
      
      if(shouldCreate.current && transactionDetails && hasPassedMoreThanTenSec(transactionDetails?.created_at)){
        shouldCreate.current = false
        let eventName = transactionDetails.items[0].name.split('_')[0]
        let ticketName = transactionDetails.items[0].name.split('_')[1]
      
        for(let i = 1 ; i < transactionDetails.items[0].quantity + 1 ; i++){
          const infoArr = transactionDetails.information[`more_info_${i}`].split('_')
          ticketArr = [
            ...ticketArr,
            {
              birthDay: infoArr[0],
              age: Number(infoArr[1]),
              gender: infoArr[3],
              phoneNumber: infoArr[2],
              instaUserName: infoArr[4],
              nationalId: infoArr[5],
              email: infoArr[6],
              fullName: infoArr[7]
            }
          ]
        }
        
            let emailArray: Array<string>
            emailArray = ticketArr.map((ticket) => (
              ticket.email
          ))
            createBoughtTickets({ approval_transaction_uid: transaction_uid as string, eventName: eventName as string, usersTicket: false, ticketsArray: ticketArr, ticketName: ticketName as string})
            .then(async () => {
              changeNumberOfBoughtTickets({eventName: eventName as string, ticketName: ticketName as string, number: 1})
              fetch('/api/email/bought', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({userName: sessionData?.user.name, usersEmails: emailArray, eventName: eventName})
              })
              fetch('/api/chargeByApprovalUid',{
                method:'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  "approval_transaction_uid": transaction_uid,
                  //@ts-ignore
                  "amount": (transactionDetails.information.amount_by_currency / 100 - transactionDetails.items[0].total_price / 100).toFixed(2) * transactionDetails.items[0].quantity
                })  
              })
            })
            .catch((error)=>{
              console.log(error)
            });
              }
    }, [])
    
  return (
    <div className={`absolute flex justify-center items-center min-h-screen h-screen bg-orange-50 w-screen ${nont.className}`}>
      <div className='flex flex-col gap-24 justify-center items-center w-screen'>
        <div className='flex flex-col gap-3 items-center '>
          <FontAwesomeIcon icon={faCircleCheck} className='text-9xl text-orange-300 '/>
          <p className='text-black text-2xl font-semibold'>העסקה בוצעה בהצלחה</p>
          <Link href={'/homePage'} className='text-black text-md font-semibold -mt-2 mb-3 p-2 bg-amber-300 rounded-md'>חזרו אל דף הבית</Link>
          <p className='text-6xl'>₪{amount}</p>
        </div>
        <div className='flex flex-col w-3/4 border-t border-b py-2 text-lg sm:w-1/3'>
          <div className='flex justify-between border-b w-full p-2 pt-0'>
            <p>{number}</p>
            <p>מספר אישור</p>
          </div>
          <div className='flex justify-between border-b w-full p-2'>
            <p>{date.toLocaleString().slice(0, -3).replace(',','')}</p>
            <p>תאריך ושעה</p>
          </div>
          <div className='flex justify-between border-b w-full p-2'>
            <div className='flex gap-2'>
              <p>{method}</p>
              <p>{four_digits}</p>
            </div>
            <p>אמצעי תשלום</p>
          </div>
          <div className='flex justify-between w-full p-2 pb-0'>
            <p>{number_of_payments}</p>
            <p>תשלומים</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Success

export async function getServerSideProps() {
  const headers = {
    'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
    'Content-Type': 'application/json'
  };
  let parsedResponse;
  try{
  const response = await fetch('https://restapidev.payplus.co.il/api/v1.0/TransactionReports/TransactionsApproval',{
    method: 'POST',
    body: JSON.stringify({
    terminal_uid: '12075a0f-ea0c-4e1d-ab9a-98b7f119d7d4',
    currency_code: 'ILS',
    skip: '0',
    take: '5'
    }),
    headers: headers
  })

  parsedResponse= await response.json()

  return {
    props: {
      response: parsedResponse
    },
  };  
}
catch(err){
  console.log('error',err)
}
}