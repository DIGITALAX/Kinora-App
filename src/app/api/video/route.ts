import { Livepeer } from "livepeer";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { TaskPhase } from "livepeer/dist/models/components";
import { UploadAssetViaURLData } from "livepeer/dist/models/operations";

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

    const results = await livepeer.asset.createViaURL({
      name: fields.name?.[0],
      url: fields.link?.[0],
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
        return NextResponse.json({
          assetId: finalAsset?.asset.playbackId,
        });
      }

      return NextResponse.json({
        assetId: parsed?.asset.playbackId,
      });
    } else {
      return NextResponse.json(
        { error: "No results from Livepeer" },
        { status: 500 }
      );
    }
  } catch (err: any) {
    console.error(err.message);
    return NextResponse.json(
      {
        error: "Error processing video upload",
        message: err.message,
      },
      { status: 500 }
    );
  }
}

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
