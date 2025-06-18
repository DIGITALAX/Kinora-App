import { Metadata } from "next";
import { Suspense } from "react";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import { tParams } from "../layout";
import { getDictionary } from "../dictionaries";
import UploadEntry from "@/app/components/Upload/modules/UploadEntry";
import { LOCALES } from "@/app/lib/constants";

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

export default async function Awards({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <UploadEntry dict={dict} />
    </Suspense>
  );
}
