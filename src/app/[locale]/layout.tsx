import { notFound } from "next/navigation";
import { isLocale } from "@/lib/cms/types";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <>{children}</>;
}