import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { useRouter } from 'next/router'

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CloudSync",
  description: "BodyView CloudSync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
