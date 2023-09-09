import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const {name, price, ticketUid, taxUid} = req.body;
        const headers = {
            'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
            'Content-Type': 'application/json'
        };

        const ticketData = {
            'category_uid': '33f2d30a-72b9-4f35-aee2-f1974c9980e6',
            'name': name,
            'price': price,
            'currency_code': 'ILS',
            'vat_type': 0,
        };

        const taxData = {
            'category_uid': 'd1647bb1-7d8f-48e1-b660-c94fa99ac3a4',
            'name': name + '_tax',
            'price': (price * 7 / 100).toFixed(2),
            'currency_code': 'ILS',
            'vat_type': 0,
        };
        const [ticketUpdateResponse, taxUpdateResponse] = await Promise.all([
            fetch(`https://restapidev.payplus.co.il/api/v1.0/Products/Update/:${ticketUid}`, {
                method: 'POST',
                body: JSON.stringify(ticketData),
                headers: headers
            }),
            fetch(`https://restapidev.payplus.co.il/api/v1.0/Products/Update/:${taxUid}`, {
                method: 'POST',
                body: JSON.stringify(taxData),
                headers: headers
            })
        ]);

        if (!ticketUpdateResponse.ok || !taxUpdateResponse.ok) {
            throw new Error('Failed to add products.');
        }

        const [ticketUpdateResult, taxUpdateResult] = await Promise.all([
            ticketUpdateResponse.json(),
            taxUpdateResponse.json()
        ]);

        res.status(200).json({ ticket: ticketUpdateResult, tax: taxUpdateResult });
    }
    catch (error) {
        //@ts-ignore
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}// yoyoyoanimetpo0

 