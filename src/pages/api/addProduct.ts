import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { name, price, action } = req.body;
        console.log(req.body)
        const headers = {
            'Authorization': `{"api_key":"${process.env.NEXT_PUBLIC_PAYPLUS_KEY}","secret_key":"${process.env.NEXT_PUBLIC_PAYPLUS_SECRET}"}`,
            'Content-Type': 'application/json'
        };

        const ticketData = {
            'category_uid': `${process.env.NEXT_PUBLIC_TICKETS_UID}`,
            'name': name,
            'price': price,
            'currency_code': 'ILS',
            'vat_type': 2,
        };

        const taxData = {
            'category_uid': `${process.env.NEXT_PUBLIC_TAX_UID}`,
            'name': name + '_tax',
            'price': (price * 7 / 100).toFixed(2),
            'currency_code': 'ILS',
            'vat_type': 2,
        };

        if(action === 'both'){
        const [ticketResponse, taxResponse] = await Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}/Products/Add`, {
                method: 'POST',
                body: JSON.stringify(ticketData),
                headers: headers
            }),
            fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}/Products/Add`, {
                method: 'POST',
                body: JSON.stringify(taxData),
                headers: headers
            })
        ]);
        if (!ticketResponse.ok || !taxResponse.ok) {
            console.log(ticketResponse, taxResponse)
            throw new Error('Failed to add products.');
        }

        const [ticketResult, taxResult] = await Promise.all([
            ticketResponse.json(),
            taxResponse.json()
        ]);
console.log(ticketResult, taxResult)
        // res.status(200).json({ ticket: ticketResult, tax: taxResult });
    }
    else if(action === 'ticket'){
        const ticketResponse = await fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}/Products/Add`, {
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
        const taxResponse = await  fetch(`${process.env.NEXT_PUBLIC_PAYPLUS_URL}/Products/Add`, {
            method: 'POST',
            body: JSON.stringify(taxData),
            headers: headers
        })
        if (!taxResponse.ok) {
            throw new Error('Failed to add products.');
        }

        const taxResult = await taxResponse.json()
console.log(taxResult)
        res.status(200).json(taxResult);
    }
    } catch (error) {
        //@ts-ignore
        console.error('Error:', error.message);
        // res.status(500).json({ error: 'Internal Server Error' });
    }
}// yoyoyoanimetpo0

 