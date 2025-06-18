import { Metadata } from "next";
import { getDictionary } from "../../[lang]/dictionaries";
import Wrapper from "../../components/Common/modules/Wrapper";
import QuestEntry from "@/app/components/Quest/modules/QuestEntry";
import { LOCALES } from "@/app/lib/constants";

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
  }>;
}) {
  const { quest } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={<QuestEntry quest={quest} dict={dict} />}
    ></Wrapper>
  );
}
