import { Metadata } from "next";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import AwardsEntry from "../components/Awards/modules/AwardsEntry";
import { LOCALES } from "../lib/constants";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `Awards | Kinora`,
    openGraph: {
      title: `Awards | Kinora`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/awards/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/awards/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Awards() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<AwardsEntry dict={dict} />}></Wrapper>;
}
