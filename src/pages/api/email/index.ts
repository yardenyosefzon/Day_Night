
import { Resend } from "resend"
import DayNNightBoughtTicketEmail from "emails/email";
import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {userName, usersEmails, eventName} = req.body
try{
console.log(usersEmails)
    await resend.sendEmail({
        from: 'onboarding@resend.dev',
        to: usersEmails,
        subject: 'Ticket purchase',
        react: DayNNightBoughtTicketEmail({userName: userName, eventName:eventName})
      },
      );

      res.status(200).json({status: "ok"})
}
catch(error: any){
    res.status(500).json(`Mail failed to be sent: ${error.message} `)
}
}