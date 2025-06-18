import { Livepeer } from "livepeer";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

const streamToNodeStream = (readableStream: ReadableStream) => {
  const reader = readableStream.getReader();
  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) {
        this.push(null);
      } else {
        this.push(value);
      }
    },
  });
};

const parseForm = (req: any): Promise<{ fields: any; files: any }> => {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm();

    form.parse(req, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files });
    });
  });
};

export async function POST(req: Request) {
  try {
    const nodeStream = streamToNodeStream(req.body as ReadableStream);

    const incomingReq = Object.assign(nodeStream, {
      headers: Object.fromEntries(req.headers.entries()),
      method: req.method,
      url: req.url,
    });

    const { fields } = await parseForm(incomingReq);

    const livepeer = new Livepeer({
      apiKey: process.env.LIVEPEER_STUDIO as string,
    });

    const results = await livepeer.asset.getAll({
      params: {
        page: Number(fields.page?.[0] || 1),
        limit: 1000,
      },
    });

    return NextResponse.json(results?.data);
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
