import type { Metadata } from "next";
import type { ReactNode } from "react";

import { AuthProvider } from "@/components/auth/auth-provider";
import { LocaleProvider } from "@/components/i18n/locale-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "Job Agent",
  description:
    "Persönlicher Karriere-Assistent für Jobsuche und Bewerbung in Deutschland.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="font-sans">
        <LocaleProvider>
          <AuthProvider>{children}</AuthProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
