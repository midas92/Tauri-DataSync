import type { Metadata } from "next";
import { useRouter } from 'next/router'

import "./globals.css";
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
      <body>
        {children}
      </body>
    </html>
  );
}
