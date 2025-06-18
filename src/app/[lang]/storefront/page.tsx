import { Metadata } from "next";
import { Suspense } from "react";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import { tParams } from "../layout";
import { getDictionary } from "../dictionaries";
import StorefrontEntry from "@/app/components/Storefront/modules/StorefrontEntry";
import { LOCALES } from "@/app/lib/constants";

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

export default async function Storefront({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <StorefrontEntry dict={dict} />
    </Suspense>
  );
}
