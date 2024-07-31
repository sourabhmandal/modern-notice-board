import { theme } from "@/app/theme";
import { ReactQueryClientProvider } from "@/components";
import { ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NextJS Template",
  description: "Template for nextjs",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  console.log("NEXTJS CUSTOM TEMPLATE :: BY SOURABH MANDAL");
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ReactQueryClientProvider>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </AppRouterCacheProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
