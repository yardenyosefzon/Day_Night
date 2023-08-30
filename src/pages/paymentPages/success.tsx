import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useContext } from 'react'
import { api } from '~/utils/api';
import { useSession } from 'next-auth/react';

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
      let ticketArr : TicketArr = []
      //@ts-ignore
      const transaction = response.transactions.filter( aprovNum => aprovNum.number === number )
      console.log(transaction)
      if(transaction && hasPassedMoreThanMinute(transaction[0]?.created_at)){
        let eventName = transaction[0].items[0].name.split('_')[0]
        let ticketName = transaction[0].items[0].name.split('_')[1]
        let ticketSlug = transaction[0].items[0].name.split('_')[2]
        for(let i = 0 ; i < transaction[0].items[0].quantity ; i++){
          const infoArr = transaction[0].information.more_info_1.split('_')
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
            createBoughtTickets({ userId: sessionData? sessionData?.user.id as string : '' , eventName: eventName as string, usersTicket: false, ticketsArray: ticketArr, ticketName: ticketName as string})
            .then(() => {
              changeNumberOfBoughtTickets({ticketSlug: ticketSlug as string})
              fetch('api/email/bought', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({userName: sessionData?.user.name, usersEmails: emailArray, eventName: eventName})
              })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Network response was not ok');
                  }
                })
            })
            .catch((error)=>{
              return error
            });
           
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