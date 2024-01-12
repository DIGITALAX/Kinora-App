import { Livepeer } from "livepeer";
import type { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { IncomingForm } from "formidable";
import { IncomingMessage } from "http";
import { TaskPhase } from "livepeer/dist/models/components";
import { UploadAssetViaURLData } from "livepeer/dist/models/operations";

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

    const results = await livepeer.asset.createViaURL({
      name: req.body.name[0],
      url: req.body.link[0],
      storage: {
        ipfs: true,
      },
    });

    if (results) {
      const parsed: UploadAssetViaURLData = JSON.parse(
        results.rawResponse?.data.toString()
      );

      if (!parsed?.asset?.status?.phase || !parsed?.asset?.playbackId) {
        const finalAsset = await checkAssetStatus(
          livepeer,
          results.data?.task.id
        );
        return res.status(200).json({ assetId: finalAsset?.asset.playbackId });
      }

      return res.status(200).json({ assetId: parsed?.asset.playbackId });
    } else {
      return res.status(500);
    }
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

const checkAssetStatus = async (
  livepeer: Livepeer,
  taskId: string | undefined,
  attempt: number = 0
): Promise<UploadAssetViaURLData> => {
  try {
    if (!taskId || attempt >= 5) {
      throw new Error("Asset ID not provided or too many attempts");
    }

    const asset = await livepeer.task.get(taskId);
    if (asset?.task?.status?.phase !== TaskPhase.Completed) {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return await checkAssetStatus(livepeer, taskId, attempt + 1);
    }
    return asset?.rawResponse?.data;
  } catch (err) {
    throw err;
  }
};
