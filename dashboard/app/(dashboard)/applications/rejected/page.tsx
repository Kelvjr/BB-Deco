import { redirect } from "next/navigation";

export default function ApplicationsRejectedRedirect() {
  redirect("/admissions/rejected");
}
