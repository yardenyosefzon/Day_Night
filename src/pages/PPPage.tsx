import axios from 'axios'
import React from 'react'

function PPPage() {
    const handleClick = () =>{
    //     fetch(`https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink`, 
    //     {
        
    //       method: 'POST',
    //       //@ts-ignore
    //       headers: {
    //         'authorization': {"api_key":process.env.NEXT_PUBLIC_PAYPLUS_KEY,"secret_key":process.env.NEXT_PUBLIC_PAYPLUS_SECRET},
    //         'origin': 'day-night-eight.vercel.app'
    //       },
    //       body: JSON.stringify({
    //         "payment_page_uid": process.env.NEXT_PUBLIC_PAYPLUS_UID,
    //         "expiry_datetime": "30",
    //         "more_info": "test1554423",
    //         "customer": {
    //           "customer_name":"David Levi",
    //           "email":"david@gmail.com",
    //           "phone":"0509111111",
    //           "vat_number": "036534683"
    //         },
    //         "amount": 30
    //         })
    //   },
    //     )
    //     .then((res) => res.json())
    //     .then((res) => console.log(res))

        fetch('/api/getPaymentLink')
        .then((res) => {
          res.json()
        })
        .then((res) => {
          console.log('result:', res)
        })
        .catch(err => {
          console.log('error:', err)
        })



    }
  return (
    <div >
        <button className='mt-24' onClick={handleClick}>push</button>
    </div>
  )
}

export default PPPage