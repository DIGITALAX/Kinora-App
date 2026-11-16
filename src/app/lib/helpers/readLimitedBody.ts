const readLimitedBody = async (
  req: Request,
  maxBytes: number
): Promise<Blob | null> => {
  const type = req.headers.get("content-type") || "";
  const reader = req.body?.getReader();
  if (!reader) return new Blob([], { type });

  const chunks: Uint8Array[] = [];
  let total = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }

  return new Blob(chunks as BlobPart[], { type });
};

export default readLimitedBody;
