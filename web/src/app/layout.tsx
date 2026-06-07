import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "CampusXATL — Your Campus Marketplace",
  description: "Buy, sell, and discover services across Atlanta's college campuses. CampusXATL connects students through a trusted local marketplace.",
  openGraph: {
    title: "CampusXATL — Your Campus Marketplace",
    description: "Buy, sell, and discover services across Atlanta's college campuses.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="h-full scroll-smooth">
        <body className="min-h-full flex flex-col antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}
