import { NextApiRequest, NextApiResponse } from "next";
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
)
{
    const body = JSON.parse(req.body)
    const {amount, ticketPrice, ticketUid, taxUid, ticketArr} = body
    const headers = {
        'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
        'Content-Type': 'application/json'
      };
      const data = {
        "payment_page_uid": process.env.NEXT_PUBLIC_PAYMENT_PAGE_UID,
        "charge_method": 2,
        "more_info_1": ticketArr[0] ? `${ticketArr[0].birthDay+'_'+ticketArr[0].age+'_'+ticketArr[0].gender+'_'+ticketArr[0].phoneNumber+'_'+ticketArr[0].instaUserName+'_'+ticketArr[0].nationalId+'_'+ticketArr[0].email+'_'+ticketArr[0].fullName}` : "",
        "more_info_2": ticketArr[1] ? `${ticketArr[1].birthDay+'_'+ticketArr[1].age+'_'+ticketArr[1].gender+'_'+ticketArr[1].phoneNumber+'_'+ticketArr[1].instaUserName+'_'+ticketArr[1].nationalId+'_'+ticketArr[1].email+'_'+ticketArr[1].fullName}` : "",
        "more_info_3": ticketArr[2] ? `${ticketArr[2].birthDay+'_'+ticketArr[2].age+'_'+ticketArr[2].gender+'_'+ticketArr[2].phoneNumber+'_'+ticketArr[2].instaUserName+'_'+ticketArr[2].nationalId+'_'+ticketArr[2].email+'_'+ticketArr[2].fullName}` : "",
        "more_info_4": ticketArr[3] ? `${ticketArr[3].birthDay+'_'+ticketArr[3].age+'_'+ticketArr[3].gender+'_'+ticketArr[3].phoneNumber+'_'+ticketArr[3].instaUserName+'_'+ticketArr[3].nationalId+'_'+ticketArr[3].email+'_'+ticketArr[3].fullName}` : "",
        "more_info_5": ticketArr[4] ? `${ticketArr[4].birthDay+'_'+ticketArr[4].age+'_'+ticketArr[4].gender+'_'+ticketArr[4].phoneNumber+'_'+ticketArr[4].instaUserName+'_'+ticketArr[4].nationalId+'_'+ticketArr[4].email+'_'+ticketArr[4].fullName}` : "",
        "refURL_success": `${process.env.NEXTAUTH_URL}/paymentPages/success`,
        "refURL_failure": `${process.env.NEXTAUTH_URL}/paymentPages/reject`,
        "refURL_callback": "https://www.domain.com/callback/",
        "items": [
          {
            "product_uid": ticketUid,
            "quantity": ticketArr.length,
            "price": ticketPrice
          },
          {
            "product_uid": taxUid,
            "quantity": ticketArr.length,
            "price": (ticketPrice * 7 / 100).toFixed(2)
          },
        ],
        "amount": amount,
        "payments": 1,
        "currency_code": "ILS",
        "sendEmailApproval": true,
        "sendEmailFailure": false,
        "hide_payments_field": true
    }
    try{
      const linkResponse = await fetch(process.env.NEXT_PUBLIC_PAYPLUS_URL+"/PaymentPages/generateLink" as string,
      {
        method:'POST',
        body: JSON.stringify(data),
        headers: headers 
      })
      res.status(200).json(await linkResponse.json())
    }
    catch(err){
        console.log('error',err)
        res.status(400).send({'error': err})
    }
  }  // yoyoyoanimetpo0 5326140280779844 process.env.NEXT_PUBLIC_PAYPLUS_URL as string PaymentPages/generateLink