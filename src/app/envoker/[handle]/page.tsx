import { Metadata } from "next";
import { getDictionary } from "../../[lang]/dictionaries";
import Wrapper from "../../components/Common/modules/Wrapper";
import EnvokerEntry from "@/app/components/Envoker/modules/EnvokerEntry";
import { LOCALES } from "@/app/lib/constants";

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

export default async function Quest({
  params,
}: {
  params: Promise<{
    handle: string;
  }>;
}) {
  const { handle } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={<EnvokerEntry handle={handle} dict={dict} />}
    ></Wrapper>
  );
}
