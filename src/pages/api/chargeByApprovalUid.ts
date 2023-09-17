import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { approval_transaction_uid, amount } = req.body;

        const headers = {
            'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
            'Content-Type': 'application/json'
        };

        const data= {
            "transaction_uid": approval_transaction_uid,
            "amount": amount
        }

        const chargeResponse = await fetch('https://restapidev.payplus.co.il/api/v1.0/Transactions/ChargeByTransactionUID',{
                method:'POST',
                headers: headers,
                body: JSON.stringify(data)  
              })
            
        if (!chargeResponse.ok) {
            throw new Error('Failed to add products.');
        }

        const chargeResult = await chargeResponse.json()
        res.status(200).json(chargeResult);

    } catch (error) {
        //@ts-ignore
        console.log('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

 