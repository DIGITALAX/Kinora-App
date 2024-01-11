import { Livepeer } from "livepeer";
import type { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";

const handler = nextConnect();

interface ExtendedRequest extends IncomingMessage {
  body: any;
  files: any;
}

handler.use(async (req: ExtendedRequest, _, next) => {
  const form = new IncomingForm();
  form.parse(req, (err, fields) => {
    if (err) {
      next(err);
      return;
    }
    req.body = fields;
    next();
  });
});

handler.post(async (req: any, res: NextApiResponse) => {
  try {
    const livepeer = new Livepeer({
      apiKey: process.env.NEXT_PUBLIC_LIVEPEER_STUDIO_KEY as string,
    });
    

    const results = await livepeer.asset.create({
      name: req.body.name[0],
      url: req.body.link[0],
      
    });

    return res.status(200).json({ assetId: results.data?.asset.playbackId });
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({
      error: "Error processing video upload",
      message: err.message,
    });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
