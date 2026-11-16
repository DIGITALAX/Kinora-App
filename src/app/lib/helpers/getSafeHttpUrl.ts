const parseHttpUrl = (value: string): string | undefined => {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : undefined;
  } catch (err: any) {
    return undefined;
  }
};

const getSafeHttpUrl = (
  value: string | undefined | null
): string | undefined => {
  if (!value) return undefined;
  const cleaned = String(value).trim();
  if (cleaned === "") return undefined;

  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(cleaned)) {
    return parseHttpUrl(cleaned);
  }

  return parseHttpUrl(`https://${cleaned.replace(/^\/\//, "")}`);
};

export default getSafeHttpUrl;
