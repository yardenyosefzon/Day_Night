import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useContext } from 'react'
import { api } from '~/utils/api';
import { MyContext } from '../components/context/context';
import { useSession } from 'next-auth/react';

function Success({response}: {response: any}) {
  console.log(response)
  const {data: sessionData} = useSession()
  const {query: {number}, replace} = useRouter()

  const { mutateAsync: createBoughtTickets } = api.boughtTickets.create.useMutation();
  const { mutate: changeNumberOfBoughtTickets } = api.schemaTickets.changeNumberOfBoughtTicketsOfOneByEventAndTicketName.useMutation()

    function hasPassedMoreThanMinute(targetDateStr: string) {
      const targetDate = new Date(targetDateStr);
      const currentDate = new Date();
      const timeDifference = currentDate.getTime() - targetDate.getTime();
      console.log(timeDifference)
      const oneMinuteInMillis = 60000; 

      return timeDifference < oneMinuteInMillis;
    }

    useEffect(() => {
      //@ts-ignore
      const transaction = response.transactions.filter( aprovNum => aprovNum.number === number )
      if(transaction && hasPassedMoreThanMinute(transaction[0]?.created_at)){
        console.log('sssssssss')
          //   let emailArray: Array<string>
          //   emailArray = formState.tickets.map((ticket) => (
          //     ticket.email
          // ))
          //   createBoughtTickets({ userId: sessionData? sessionData?.user.id as string : '' , eventName: eventName as string, usersTicket: false, ticketsArray: formState.tickets, ticketName: ticketName as string})
          //   .then(() => {
          //     changeNumberOfBoughtTickets({ticketSlug: ticketSlug as string})
          //     fetch('api/email/bought', {
          //       method: 'POST',
          //       headers: {
          //         'Content-Type': 'application/json'
          //       },
          //       body: JSON.stringify({userName: sessionData?.user.name, usersEmails: emailArray, eventName: eventName})
          //     })
          //       .then(response => {
          //         if (!response.ok) {
          //           throw new Error('Network response was not ok');
          //         }
          //       })
          //   })
          //   .catch((error)=>{
          //     return error
          //   });
           
              }
    }, [])
    
  return (
    <div className='absolute z-50'>This is a success</div>
  )
}

export default Success

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const headers = {
    'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
    'Content-Type': 'application/json'
  };
  let parsedResponse;
  try{
  const response = await fetch('https://restapidev.payplus.co.il/api/v1.0/TransactionReports/TransactionsHistory',{
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
      response: parsedResponse,
    },
  };  
}
catch(err){
  console.log('error',err)
}
}