import { NextApiRequest, NextApiResponse } from "next";

export default async function (
    req: NextApiRequest,
    res: NextApiResponse
)
{
    const headers = {
        'Authorization': '{"api_key":"0015139a-ccdc-4790-9d18-d1764266e67a","secret_key":"e8add8b6-1e63-4768-9fab-76691c2f8023"}',
        'Content-Type': 'application/json'
      };
      const data = {
        "charge_method": "1",
        "currency_code": "ILS",
        "payment-page-uid": "7a95d93f-82fe-4308-a5b5-57709701bb0e",
        "expiry_datetime": "30",
        "more_info": "test1554423",
        "customer": {
          "customer_name": "David Levi",
          "email": "david@gmail.com",
          "phone": "0509111111",
          "vat_number": "036534683"
        },
        "amount": 30
      };
    try{
      const response = await fetch('https://restapidev.payplus.co.il/api/v1.0/PaymentPages/generateLink',
      {
        method:'POST',
        body: JSON.stringify(data),
        headers: headers 
      })
      console.log(response)
      res.end(JSON.stringify({'result': response}))
    }
    catch(err){
        console.log('error',err)
        
         res.end(JSON.stringify({'error': err}))
    }

 }  // yoyoyoanimetpo0