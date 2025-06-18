import { Metadata } from "next";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import StorefrontEntry from "../components/Storefront/modules/StorefrontEntry";
import { LOCALES } from "../lib/constants";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `Storefront | Kinora`,
    openGraph: {
      title: `Storefront | Kinora`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/storefront/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/storefront/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Storefront() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<StorefrontEntry dict={dict} />}></Wrapper>;
}
