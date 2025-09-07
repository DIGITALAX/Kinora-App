import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { LOCALES } from "./lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL("https://kinora.irrevocable.dev/"),
  title: "Kinora",
  robots: {
    googleBot: {
      index: true,
      follow: true,
    },
  },
  description: "On-Chain Video Social Quests.",
  keywords:
    "Web3, Web3 Fashion, Moda Web3, Open Source, CC0, Emma-Jane MacKinnon-Lee, Open Source LLMs, DIGITALAX, F3Manifesto, digitalax.xyz, f3manifesto.xyz, Women, Life, Freedom.",
  twitter: {
    card: "summary_large_image",
    site: "@digitalax_",
    title: "Kinora",
    description: "On-Chain Video Social Quests.",
  },
  openGraph: {
    title: "Kinora",
    description: "On-Chain Video Social Quests.",
  },
  creator: "Emma-Jane MacKinnon-Lee",
  publisher: "Emma-Jane MacKinnon-Lee",
  alternates: {
    canonical: `https://kinora.irrevocable.dev`,
    languages: LOCALES.reduce((acc, item) => {
      acc[item] = `https://kinora.irrevocable.dev/${item}/`;
      return acc;
    }, {} as { [key: string]: string }),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Kinora",
              url: "https://kinora.irrevocable.dev/",
              founder: {
                "@type": "Person",
                name: "Emma-Jane MacKinnon-Lee",
                url: "https://emmajanemackinnonlee.com/",
                sameAs: [
                  "https://emmajanemackinnonlee.com/",
                  "https://syntheticfutures.xyz/",
                  "https://web3fashion.xyz/",
                  "https://emancipa.xyz/",
                  "https://highlangu.com/",
                  "https://digitalax.xyz/",
                  "https://cc0web3fashion.com/",
                  "https://cc0web3.com/",
                  "https://cuntism.net/",
                  "https://dhawu.com/",
                  "https://casadeespejos.com/",
                  "https://twitter.com/emmajane1313",
                  "https://medium.com/@casadeespejos",
                  "https://www.flickr.com/photos/emmajanemackinnonlee/",
                ],
              },
            }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
