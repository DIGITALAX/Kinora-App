import { Metadata } from "next";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import EnvokeEntry from "../components/Envoke/modules/EnvokeEntry";
import { LOCALES } from "../lib/constants";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `Envoke | Kinora`,
    openGraph: {
      title: `Envoke | Kinora`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/envoke/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/envoke/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Envoke() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<EnvokeEntry dict={dict} />}></Wrapper>;
}
