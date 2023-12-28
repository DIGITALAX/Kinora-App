import type { NextApiResponse } from "next";
import nextConnect from "next-connect";

const handler = nextConnect();

handler.post(async (_, res: NextApiResponse) => {
  try {
    const results = await fetch("https://livepeer.studio/api/asset", {
      headers: {
        Authorization: "Bearer " + process.env.LIVEPEER_STUDIO_KEY as string,
      },
    });
    const json = await results.json();
    return res.status(200).json({ json });
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
