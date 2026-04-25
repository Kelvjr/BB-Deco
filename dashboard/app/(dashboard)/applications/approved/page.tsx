import { redirect } from "next/navigation";

export default function ApplicationsApprovedRedirect() {
  redirect("/admissions/approved");
}
