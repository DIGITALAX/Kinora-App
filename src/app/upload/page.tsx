import { Metadata } from "next";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import UploadEntry from "../components/Upload/modules/UploadEntry";
import { LOCALES } from "../lib/constants";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `Upload | Kinora`,
    openGraph: {
      title: `Upload | Kinora`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/upload/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/upload/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Upload() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<UploadEntry dict={dict} />}></Wrapper>;
}
