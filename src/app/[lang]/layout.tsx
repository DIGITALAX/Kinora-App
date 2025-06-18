import Footer from "../components/Common/modules/Footer";
import Header from "../components/Common/modules/Header";
import Modals from "../components/Modals/modules/Modals";

export type tParams = Promise<{ lang: string }>;
export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "es" }];
}

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: tParams;
}>) {
  return (
    <div className="relative w-full h-full flex bg-fuzz flex-col">
      <Header params={params} />
      {children}
      <Modals params={params} />
      <Footer />
    </div>
  );
}
