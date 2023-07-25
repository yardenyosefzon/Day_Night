import { v2 as cloudinary } from "cloudinary";
import { NextApiRequest, NextApiResponse } from "next";
import { env } from "process";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body) || {};
  const { paramsToSign } = body;

  try {
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET as string,
    );
    res.status(200).json({
      signature,
    });
  } catch (error) {
    res.status(500).json({
      error: error
    });
  }
}