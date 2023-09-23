import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { transaction_uid } = req.body;

        const headers = {
            'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
            'Content-Type': 'application/json'
        };

        const data= {
            "transaction_uid": transaction_uid
        }

        const viewResponse = await fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}/Transactions/View`,{
                method:'POST',
                headers: headers,
                body: JSON.stringify(data)  
              })
            
        if (!viewResponse.ok) {
            throw new Error('Failed to add products.');
        }

        const viewResult = await viewResponse.json()
        res.status(200).json(viewResult);

    } catch (error) {
        //@ts-ignore
        console.log('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

 