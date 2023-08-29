import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import React, { useEffect, useContext } from 'react'
import { api } from '~/utils/api';
import { MyContext } from '../components/context/context';
import { useSession } from 'next-auth/react';

// https://www.daynight.co.il/paymentPages/success?transaction_uid=ecf8a90d-cbcc-489b-b633-6672329be89c&page_request_uid=1439a295-9c38-4bf5-8b5d-4b5896bd71d9&is_multiple_transaction=false&type=Approval&method=credit-card&number=wPMt4WK0HI&date=2023-08-29+22%3A06%3A42&status=approved&status_code=000&status_description=%D7%94%D7%A2%D7%A1%D7%A7%D7%94+%D7%91%D7%95%D7%A6%D7%A2%D7%94+%D7%91%D7%94%D7%A6%D7%9C%D7%97%D7%94&amount=85.6&currency=ILS&credit_terms=regular&number_of_payments=1&secure3D_status=&secure3D_tracking=false&approval_num=0621514D&card_foreign=0&voucher_num=22-365-77&more_info=test1554423&add_data=&customer_uid=a378584f-9d58-4e41-a561-08253f7fd273&customer_email=sample%40domain.com&company_name=%D7%91%D7%93%D7%99%D7%A7%D7%95%D7%AA&company_registration_number=879484&terminal_uid=12075a0f-ea0c-4e1d-ab9a-98b7f119d7d4&terminal_name=%D7%91%D7%93%D7%99%D7%A7%D7%94+EMV&terminal_merchant_number=0882714012&cashier_uid=dcbb1ffb-9a1a-4af7-9370-e1bd3c16b5b7&cashier_name=%D7%A8%D7%90%D7%A9%D7%99%D7%AA&four_digits=9844&expiry_month=05&expiry_year=26&alternative_method=false&customer_name=general+customer+-+%D7%9C%D7%A7%D7%95%D7%97+%D7%9B%D7%9C%D7%9C%D7%99&customer_name_invoice=general+customer+-+%D7%9C%D7%A7%D7%95%D7%97+%D7%9B%D7%9C%D7%9C%D7%99&identification_number=&clearing_id=1&brand_id=7&issuer_id=1&extra_3=&card_holder_name=Test&card_bin=532614&more_info_1=&more_info_2=&more_info_3=&more_info_4=&more_info_5=&invoice_uuid=&invoice_docu_number=&invoice_original_url=&invoice_copy_url=&invoice_integrator_name=&invoice_status=&clearing_name=not+recognized&brand_name=mastercard&issuer_name=isracard

function Success({response}: {response: any}) {
  const {data: sessionData} = useSession()
  const {query: {number}, replace} = useRouter()
  const contextValue = useContext(MyContext)
  const formState = contextValue?.formState
  const eventName = contextValue.eventName;
  const ticketSlug = contextValue.ticketSlug;
  const ticketName = contextValue.ticketName;
  const { mutateAsync: createBoughtTickets } = api.boughtTickets.create.useMutation();

  const {mutate: changeNumberOfBoughtTickets} = api.schemaTickets.changeNumberOfBoughtTicketsOfOneByEventAndTicketName.useMutation()

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
      if(transaction && hasPassedMoreThanMinute(transaction[0].created_at)){
            let emailArray: Array<string>
            emailArray = formState.tickets.map((ticket) => (
              ticket.email
          ))
            createBoughtTickets({ userId: sessionData? sessionData?.user.id as string : '' , eventName: eventName as string, usersTicket: false, ticketsArray: formState.tickets, ticketName: ticketName as string})
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
      response: parsedResponse,
    },
  };  
}
catch(err){
  console.log('error',err)
}
}