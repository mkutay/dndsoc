import { redirect } from "next/navigation";

import { ErrorPage } from "@/components/error-page";

export default async function Page({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { error } = await searchParams;
  if (!error) return redirect("/");
  if (Array.isArray(error)) return redirect("/error?error=" + error[0]);
  return <ErrorPage error={error} caller="/error/page.tsx" />;
}