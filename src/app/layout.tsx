import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Regex Playground",
  description: "Interactive regex testing and debugging tool",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-surface text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
