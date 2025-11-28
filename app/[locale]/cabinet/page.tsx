import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { UserCabinet } from "@/components/cabinet/UserCabinet";
import { Locale } from "@/lib/translations";

export default async function CabinetPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "USER") {
    redirect(`/${locale}/cabinet/login`);
  }

  return <UserCabinet locale={locale} />;
}
