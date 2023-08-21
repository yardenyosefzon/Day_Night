import { NextApiRequest, NextApiResponse } from "next";

export default async function (
    req: NextApiRequest,
    res: NextApiResponse
)
{
    const headers = {
        'Authorization': '{"api_key":"9816e5fb-6284-4086-a051-5e54bac6976f","secret_key":"2791156f-5a9d-4567-905c-f246e5127720"}',
        'Content-Type': 'application/json'
      };
      console.log(headers)
    //   request.setRequestHeader('Authorization', '{"api_key":"a5f514de-c8c8-262a-ac31-31d609f3550a","secret_key":"404b1fd6-9fc5-1533-a121-126fa6cc0c8f"}');
      const data = {
        "payment-page-uid": `"${process.env.NEXT_PUBLIC_PAYPLUS_UID}"`,
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
      const responseJson = await response.json()
      console.log(responseJson)
      return res.end(JSON.stringify({'result': responseJson}))
    }
    catch(err){
        return res.end(JSON.stringify({'error': err}))
    }

}   