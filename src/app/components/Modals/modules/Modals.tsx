import { getDictionary } from "@/app/[lang]/dictionaries";
import ModalsEntry from "./ModalsEntry";
import { tParams } from "@/app/[lang]/layout";

export default async function Modals({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return <ModalsEntry dict={dict} />;
}
