import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

interface GetOrganizationResult {
  organization: {
    id: string;
    name: string;
    slug: string;
    [key: string]: any;
  };
  session: {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  };
}

export async function validateOrganizationFromSlug(
  slug: string,
  config: {
    redirectTo?: string;
    includeSession?: boolean;
  } = {}
): Promise<GetOrganizationResult> {
  const { redirectTo = "/login", includeSession = true } = config;

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect(redirectTo);
  }

  const organization = await prisma.organization.findFirst({
    where: {
      slug,
      memberships: {
        some: {
          userId: session.user.id,
        },
      },
    },
  });

  if (!organization) {
    redirect("/app");
  }

  return {
    organization,
    session,
  };
}