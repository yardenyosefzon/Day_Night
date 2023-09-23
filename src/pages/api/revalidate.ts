//http://localhost:3000/api/revalidate?path=/&secret=process.env.MY_SECRET_TOKEN
//http://localhost:3000/api/revalidate?path=/&secret=HXdxvPEtLGsR6mapUIk5rw==
import { NextApiRequest, NextApiResponse } from "next";

export default async function (
    req: NextApiRequest,
    res: NextApiResponse
)
{
    if(req.body.secret !== process.env.NEXT_PUBLIC_MY_SECRET_TOKEN){
        return res.status(401).json({message: 'Invalid token'})
    }
    const path = req.query.path as string
    try{
        await res.revalidate(path)

        return res.json({ revalidated: true  })
    }
    catch(err){
        console.log(err)
        //@ts-ignore
        return res.status(500).json({error: err.message})
    }

}   