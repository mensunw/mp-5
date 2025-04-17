import type { Metadata } from "next";
import './globals.css'
import Header from "@/components/universal/Header"
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: "URL Shortener",
  description: "Shortens a given URL",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <Header />
        <hr />
        {children}
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
