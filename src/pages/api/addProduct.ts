import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { name, price, action } = req.body;
        const headers = {
            'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
            'Content-Type': 'application/json'
        };

        const ticketData = {
            'category_uid': '33f2d30a-72b9-4f35-aee2-f1974c9980e6',
            'name': name,
            'price': price,
            'currency_code': 'ILS',
            'vat_type': 2,
        };

        const taxData = {
            'category_uid': 'd1647bb1-7d8f-48e1-b660-c94fa99ac3a4',
            'name': name + '_tax',
            'price': (price * 7 / 100).toFixed(2),
            'currency_code': 'ILS',
            'vat_type': 2,
        };

        if(action === 'both'){
        const [ticketResponse, taxResponse] = await Promise.all([
            fetch('https://restapidev.payplus.co.il/api/v1.0/Products/Add', {
                method: 'POST',
                body: JSON.stringify(ticketData),
                headers: headers
            }),
            fetch('https://restapidev.payplus.co.il/api/v1.0/Products/Add', {
                method: 'POST',
                body: JSON.stringify(taxData),
                headers: headers
            })
        ]);
        if (!ticketResponse.ok || !taxResponse.ok) {
            throw new Error('Failed to add products.');
        }

        const [ticketResult, taxResult] = await Promise.all([
            ticketResponse.json(),
            taxResponse.json()
        ]);

        res.status(200).json({ ticket: ticketResult, tax: taxResult });
    }
    else if(action === 'ticket'){
        const ticketResponse = await fetch('https://restapidev.payplus.co.il/api/v1.0/Products/Add', {
            method: 'POST',
            body: JSON.stringify(ticketData),
            headers: headers
        })
        if (!ticketResponse.ok) {
            throw new Error('Failed to add products.');
        }

        const ticketResult = await ticketResponse.json()

        res.status(200).json(ticketResult);
    }
    else{
        const taxResponse = await  fetch('https://restapidev.payplus.co.il/api/v1.0/Products/Add', {
            method: 'POST',
            body: JSON.stringify(taxData),
            headers: headers
        })
        if (!taxResponse.ok) {
            throw new Error('Failed to add products.');
        }

        const taxResult = await taxResponse.json()

        res.status(200).json(taxResult);
    }
    } catch (error) {
        //@ts-ignore
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}// yoyoyoanimetpo0

 