import { Suspense } from "react";
import { tParams } from "../layout";
import NotFoundEntry from "@/app/components/Common/modules/NotFoundEntry";
import { getDictionary } from "../dictionaries";
import RouterChange from "@/app/components/Common/modules/RouterChange";

export default async function NotFound({ params }: { params: tParams }) {
  const { lang } = await params;
  const dict = await (getDictionary as (locale: any) => Promise<any>)(lang);
  return (
    <Suspense fallback={<RouterChange />}>
      <NotFoundEntry dict={dict} />
    </Suspense>
  );
}
