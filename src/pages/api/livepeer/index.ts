import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Livepeer } from "livepeer";
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

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const livepeer = new Livepeer({
      apiKey: process.env.LIVEPEER_STUDIO as string,
    });

    const results = await livepeer.asset.getAll({
      params: {
        page: Number(req.body.page[0]),
        limit: 1000,
      },
    });
    return res.status(200).json(results?.data);
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).json({ error: err.message });
  }
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
