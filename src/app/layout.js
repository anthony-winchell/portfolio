import { Inter, JetBrains_Mono } from "next/font/google";
import Bufferline from "@/components/Bufferline";
import StatusLine from "@/components/StatusLine";
import FileTree from "@/components/FileTree";
import VimKeys from "@/components/VimKeys";
import { site } from "@/data/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const description =
  "Software engineer building backend systems and developer tools with Go, React, and Next.js.";

export const metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Anthony Winchell | Software Engineer",
    template: "%s | Anthony Winchell",
  },
  description,
  openGraph: { type: "website", siteName: site.name },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        <Bufferline />
        <div className="flex flex-1 flex-col md:flex-row">
          <FileTree />
          <main className="min-w-0 flex-1">{children}</main>
        </div>
        <StatusLine />
        <VimKeys />
      </body>
    </html>
  );
}
