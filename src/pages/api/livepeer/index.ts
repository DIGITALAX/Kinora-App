import type { NextApiResponse } from "next";
import nextConnect from "next-connect";
import { Livepeer } from "livepeer";
import { Asset } from "@livepeer/react";

const handler = nextConnect();

handler.post(async (_, res: NextApiResponse) => {
  try {
    const livepeer = new Livepeer({
      apiKey: process.env.LIVEPEER_STUDIO as string,
    });

    let allAssets: Asset[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const results = await livepeer.asset.getAll({
        params: {
          page: page,
          limit: 100,
        },
      });
      allAssets = allAssets.concat(results.data as Asset[]);

      if ((results?.data && results?.data?.length < 100) || !results?.data) {
        hasMore = false;
        break;
      } else {
        page++;
        await delay(1000);
      }
    }

    return res.status(200).json(allAssets);
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
