import { getDictionary } from "@/app/[lang]/dictionaries";
import RouterChange from "@/app/components/Common/modules/RouterChange";
import VideoEntry from "@/app/components/Video/modules/VideoEntry";
import { LOCALES } from "@/app/lib/constants";
import { Metadata } from "next";
import { Suspense } from "react";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{
    video: string;
  }>;
}): Promise<Metadata> => {
  const { video } = await params;

  return {
    title: `Kinora Video | ${video}`,
    openGraph: {
      title: `Kinora Video | ${video}`,
    },
    alternates: {
      canonical: `https://kinora.irrevocable.dev/video/${video}/`,
      languages: LOCALES.reduce((acc, item) => {
        acc[item] = `https://kinora.irrevocable.dev/${item}/video/${video}/`;
        return acc;
      }, {} as { [key: string]: string }),
    },
  };
};

export default async function Video({
  params,
}: {
  params: Promise<{
    video: string;
    lang: string;
  }>;
}) {
  const { video, lang } = await params;

  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <VideoEntry dict={dict} video={video} />
    </Suspense>
  );
}
