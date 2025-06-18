import { Metadata } from "next";
import { getDictionary } from "../[lang]/dictionaries";
import Wrapper from "../components/Common/modules/Wrapper";
import ActivityEntry from "../components/Activity/modules/ActivityEntry";
import { LOCALES } from "../lib/constants";

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: `Activity | Kinora`,
    openGraph: {
      title: `Activity | Kinora`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/activity/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/activity/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Activity() {
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return <Wrapper dict={dict} page={<ActivityEntry dict={dict} />}></Wrapper>;
}
