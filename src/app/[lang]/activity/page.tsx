import { Metadata } from "next";
import { Suspense } from "react";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import { tParams } from "../layout";
import { getDictionary } from "../dictionaries";
import ActivityEntry from "@/app/components/Activity/modules/ActivityEntry";
import { LOCALES } from "@/app/lib/constants";

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

export default async function Activity({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <ActivityEntry dict={dict} />
    </Suspense>
  );
}
