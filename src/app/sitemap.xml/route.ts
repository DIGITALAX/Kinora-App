import { NextResponse } from "next/server";
import { INFURA_GATEWAY_INTERNAL } from "../lib/constants";
import { getQuests } from "../../../graphql/getQuests";

const locales = ["en", "es"];

function escapeXml(unsafe: string) {
  if (!unsafe) return "";
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case "&":
        return "&amp;";
      case "'":
        return "&apos;";
      case '"':
        return "&quot;";
      default:
        return c;
    }
  });
}

export async function GET() {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://kinora.irrevocable.dev";
  const data = await getQuests(1000, 0);

  const quests = data?.data?.questInstantiateds || [];

  const questsXml = quests
    .map((quest: any) => {
      const rawTitle = quest?.questMetadata?.title ?? "";
      const title = escapeXml(rawTitle.replace(/-/g, " "));
      const image = quest?.questMetadata?.cover?.split("ipfs://")?.[1];

      return `
      <url>
        <loc>${baseUrl}/quest/${quest?.postId}/</loc>
        ${locales
          .map(
            (altLocale) => `
          <xhtml:link rel="alternate" hreflang="${altLocale}" href="${baseUrl}/${altLocale}/quest/${quest?.postId}/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/quest/${
        quest?.postId
      }/" />
        <image:image>
          <image:loc>${INFURA_GATEWAY_INTERNAL}${image}</image:loc>
          <image:title><![CDATA[${title} | Kinora Quest | DIGITALAX]]></image:title>
          <image:caption><![CDATA[${title} | Kinora Quest | DIGITALAX]]></image:caption>
        </image:image>
      </url>
    `;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset 
      xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
      xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
      xmlns:xhtml="http://www.w3.org/1999/xhtml"
    >
      <url>
        <loc>${baseUrl}/</loc>
        ${locales
          .map(
            (locale) => `
          <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/" />
      </url>
      <url>
        <loc>${baseUrl}/storefront/</loc>
        ${locales
          .map(
            (locale) => `
          <xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}/${locale}/storefront/" />
          `
          )
          .join("")}
        <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/storefront/" />
      </url>
      ${questsXml}
    </urlset>`;

  return new NextResponse(body, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
