import { SWRProvider, ThemeModeProvider } from "@/components";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "NextJS Template",
  description: "Template for nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <SWRProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeModeProvider>
              <Suspense>
                <SessionProvider>{children}</SessionProvider>
              </Suspense>
            </ThemeModeProvider>
          </AppRouterCacheProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
