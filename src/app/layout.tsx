import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import '@/i18n';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hệ thống Giám sát Nông nghiệp | Mekong Delta",
  description: "Công cụ giám sát áp lực môi trường cho Mekong Delta - Dành cho Chính phủ và Nông dân",
  keywords: ["Mekong Delta", "Nông nghiệp", "Giám sát", "Stress Index", "Bản đồ", "Lũ", "Mặn", "Nóng"],
  authors: [{ name: "Delta Team" }],
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
