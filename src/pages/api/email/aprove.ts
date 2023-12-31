import { Resend } from "resend"
import { NextApiRequest, NextApiResponse } from "next";
import AprovedTicketEmail from "emails/aprroved";

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {email, qrCode, eventName} = req.body
try{
    await resend.sendEmail({
        from: 'support@daynight.co.il',
        to: email,
        subject: 'אישור כרטיס',
        react: AprovedTicketEmail({
            qrCode: qrCode,
            eventName: eventName
        })
      },
      );

      res.status(200).json({status: "ok"})
}
catch(error: any){
    res.status(500).json(`Mail failed to be sent: ${error.message} `)
}
}