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
        subject: 'ביטול של אישור הכרטיס',
        react: Generic({
          userName: userName,
          mainText: `כרטיס הנרכש עבור האירוע ${eventName} ואושר בעבר חזר לרשימת הממתינים`,
          seconderyText: ` כעת לא ניתן להשתמש בברקוד ככרטיס כניסה לאירוע. מייל ישלח מיד עם אישור או דחיית ההזמנה`,
        })
      },
      );

      res.status(200).json({status: "ok"})
}
catch(error: any){
    res.status(500).json(`Mail failed to be sent: ${error.message} `)
}
}