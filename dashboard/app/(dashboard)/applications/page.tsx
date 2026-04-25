import { redirect } from "next/navigation";

export default function ApplicationsIndexRedirect() {
  redirect("/admissions/all");
}
