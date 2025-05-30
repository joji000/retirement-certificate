import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "Retirement Certificate",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster richColors position="top-right" />
        <div className="flex h-screen ">
          <Sidebar />
          <div className="flex-1 flex flex-col">
            <Header />
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
