import './globals.css';
import type { Metadata } from 'next';
import { SessionProvider } from "@/components/providers/session-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getUserPreferences } from "@/lib/actions/preferences";
import { PreferencesProvider } from '@/providers/preferences-provider';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

export const metadata: Metadata = {
  title: 'Platform',
  description: 'Platform built with Next.js',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const preferences = session?.user ? await getUserPreferences() : null;

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-roboto antialiased">
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme={preferences?.theme || "light"}
            enableSystem
          >
            <PreferencesProvider
              defaultTheme={preferences?.theme || "light"}
              defaultOrganizationId={preferences?.defaultOrganizationId}
            >
              {children}
              <Toaster />
            </PreferencesProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}