import { getUserOrganizations } from "@/lib/actions/organization";
import { redirect } from "next/navigation";

export default async function AppPage() {
  const organizations = await getUserOrganizations();

  if (organizations.length > 0) {
    redirect(`/app/${organizations[0].slug}`);
  } else {
    redirect("/create-organization");
  }
}
