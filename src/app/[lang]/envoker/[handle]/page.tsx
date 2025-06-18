import { getDictionary } from "@/app/[lang]/dictionaries";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import EnvokerEntry from "@/app/components/Envoker/modules/EnvokerEntry";
import { LOCALES } from "@/app/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    handle: string;
  }>;
}): Promise<Metadata> => {
  const { handle } = await params;

  return {
    title: `Kinora Envoker | ${handle}`,
    openGraph: {
      title: `Kinora Envoker | ${handle}`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/envoker/${handle}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/envoker/${handle}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Envoker({
  params,
}: {
  params: Promise<{
    handle: string;
    lang: string;
  }>;
}) {
  const { handle, lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <EnvokerEntry dict={dict} handle={handle} />
    </Suspense>
  );
}
