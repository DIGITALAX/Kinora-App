import { getDictionary } from "@/app/[lang]/dictionaries";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import QuestEntry from "@/app/components/Quest/modules/QuestEntry";
import { LOCALES } from "@/app/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    quest: string;
  }>;
}): Promise<Metadata> => {
  const { quest } = await params;

  return {
    title: `Kinora Quest | ${quest}`,
    openGraph: {
      title: `Kinora Quest | ${quest}`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/quest/${quest}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/quest/${quest}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Quest({
  params,
}: {
  params: Promise<{
    quest: string;
    lang: string;
  }>;
}) {
  const { quest, lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <QuestEntry dict={dict} quest={quest} />
    </Suspense>
  );
}
