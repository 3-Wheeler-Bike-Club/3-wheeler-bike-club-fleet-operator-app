import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import { Footer } from "@/components/bottom/footer";
import Providers from "@/context/providers";
import { Toaster } from "@/components/ui/sonner";


const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "3 Wheeler Bike Club | Ownership, Community & Governance",
  description: "Fleet Operators Ownership Platform for the 3 Wheeler Bike Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.className}`}
      >
        <Providers>
          {children}
          <Footer />
          <Toaster expand={true} richColors />
        </Providers>
      </body>
    </html>
  );
}
