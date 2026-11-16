const HTML_ENTITIES: { [key: string]: string } = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const escapeHtml = (value: string | undefined | null): string => {
  if (value === undefined || value === null) return "";
  return String(value).replace(/[&<>"']/g, (char) => HTML_ENTITIES[char]);
};

export default escapeHtml;
