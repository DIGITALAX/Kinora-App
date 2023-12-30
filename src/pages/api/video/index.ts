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
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    req.body = fields;
    req.files = files;
    next();
  });
});

handler.post(async (req: any, res: NextApiResponse) => {
  try {
    const livepeer = new Livepeer({
      apiKey: process.env.LIVEPEER_STUDIO_KEY as string,
    });

    const results = await livepeer.asset.create({
      name: req.body.name,
      staticMp4: req.files.file,
    });

    return res.status(200).json({ assetId: results.data?.asset.playbackId });
  } catch (err: any) {
    console.error(err.message);
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
