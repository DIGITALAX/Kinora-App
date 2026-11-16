import escapeHtml from "./escapeHtml";
import getSafeHttpUrl from "./getSafeHttpUrl";

const descriptionRegex = (description: string, colorChange: boolean) => {
  const color = colorChange ? "#f9ed00" : "#81A8F8";
  const replacedDescription = description?.replace(/\n\n/g, "\n \n");
  const lines = replacedDescription?.split(/[\r\n]+/);
  const styledLines = lines?.map((line: string) => {
    const words = line.split(/(?=[@#])|\s+/);
    const styledWords = words.map((word: string) => {
      const safeWord = escapeHtml(word);
      if (word[0] === "#") {
        return `<em id="hashtags" style="color: ${color}; font-style: normal; word-break: break-all; margin-right: 4px;">${safeWord}</em>`;
      } else if (word[0] === "@") {
        const handle = escapeHtml(
          word?.includes(".lens")
            ? word?.replace(".lens", "")?.replace("@", "")
            : word?.replace("@", "")
        );
        return `
                <a href="https://cypher.digitalax.xyz/autograph/${handle}" rel="noreferrer" target="_blank" style="word-break: break-all; margin-right: 4px;">
                  <span style="color: ${color};">${safeWord}</span>
                </a>
              `;
      } else if (
        word.startsWith("http") ||
        word.startsWith("www.") ||
        word.endsWith(".xyz") ||
        word.endsWith(".com")
      ) {
        const safeUrl = getSafeHttpUrl(word);
        if (!safeUrl) {
          return safeWord;
        }
        return `
                <a href="${escapeHtml(
                  safeUrl
                )}" style="word-break: break-all; margin-right: 4px;" target="_blank" rel="noreferrer">
                  <span style="color: ${color};">${safeWord}</span>
                </a>
              `;
      } else {
        return safeWord;
      }
    });
    const styledLine = `<span>${styledWords?.join(" ")}</span>`;
    return styledLine;
  });
  const formattedDescription = styledLines?.join("<br />");
  return `<div style="word-wrap: break-word; max-width: 100%;">${formattedDescription}</div>`;
};

export default descriptionRegex;
