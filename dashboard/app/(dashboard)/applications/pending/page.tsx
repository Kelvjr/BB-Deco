import { redirect } from "next/navigation";

export default function ApplicationsPendingRedirect() {
  redirect("/admissions/pending");
}
