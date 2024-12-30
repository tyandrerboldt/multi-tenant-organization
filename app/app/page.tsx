import { getUserOrganizations } from "@/lib/actions/organization";
import { getUserPreferences } from "@/lib/actions/preferences";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AppPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login");
  }

  const [organizations, preferences] = await Promise.all([
    getUserOrganizations(),
    getUserPreferences(),
  ]);

  // Check for default organization in preferences
  if (preferences?.defaultOrganizationId) {
    const defaultOrg = organizations.find(
      org => org.id === preferences.defaultOrganizationId
    );
    if (defaultOrg) {
      redirect(`/app/${defaultOrg.slug}`);
    }
  }

  // Fallback to first organization or create organization page
  if (organizations.length > 0) {
    redirect(`/app/${organizations[0].slug}`);
  } else {
    redirect("/create-organization");
  }
}