import { Resend } from "resend"
import Generic from "emails/generic";
import { NextApiRequest, NextApiResponse } from "next";

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const {userName, usersEmails, eventName} = req.body
try{
   
    await resend.sendEmail({
        from: 'support@daynight.co.il',
        to: usersEmails,
        subject: 'רכישת כרטיס',
        react: Generic({
            userName: userName,
            eventName: eventName,
            mainText: `אנו מודים לכם על רכישת כרטיס לאירוע`,
            seconderyText: `אתם תקבלו הודעה למייל זה ברגע שהמפיק יאשר או ידחה את כרטיסכם`
        })
      },
      );

      res.status(200).json({status: "ok"})
}
catch(error: any){
    res.status(500).json(`Mail failed to be sent: ${error.message} `)
}
}