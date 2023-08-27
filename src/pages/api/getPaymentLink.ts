import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
)
{
    const {amount} = JSON.parse(req.body)
    const headers = {
        'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
        'Content-Type': 'application/json'
      };
      const data = {
        payment_page_uid: "cdd2d18d-31ff-4da5-874e-fe6536ffb65e",
        more_info: "test1554423",
        charge_method: 2,
        hide_other_charge_methods: true,
        refURL_success: "https://www.daynight.co.il/paymentPages/success",
        customer: {
            customer_name:"David Levi",
            email:"david@gmail.com",
            phone:"0509111111",
            vat_number: "036534683"
        },
        amount: amount,
        currency_code: "ILS",
        sendEmailApproval: true,
        sendEmailFailure: false
    }
    try{
      const response = await fetch('https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink',
      {
        method:'POST',
        body: JSON.stringify(data),
        headers: headers 
      })
      res.status(response.status).send(await response.json());
    }
    catch(err){
        console.log('error',err)
        res.status(400).send({'error': err})
    }

 }  // yoyoyoanimetpo0