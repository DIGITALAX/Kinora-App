import { Metadata } from "next";
import { getDictionary } from "../../[lang]/dictionaries";
import Wrapper from "../../components/Common/modules/Wrapper";
import VideoEntry from "../../components/Video/modules/VideoEntry";
import { LOCALES } from "@/app/lib/constants";

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
  }>;
}) {
  const { video } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)("en");
  return (
    <Wrapper
      dict={dict}
      page={<VideoEntry video={video} dict={dict} />}
    ></Wrapper>
  );
}
