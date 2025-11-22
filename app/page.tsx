import { redirect } from "next/navigation";
import { defaultLocale } from "../lib/translations";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
