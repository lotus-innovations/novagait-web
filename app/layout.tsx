import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://demo.lotusinnovations.io"),
  title: {
    default: "Novagait Physical Therapy: Accessible Clinic Demo",
    template: "%s · Novagait Physical Therapy",
  },
  description:
    "Fictional physical-therapy clinic site demonstrating WCAG 2.2 AA accessibility. A Lotus Innovations before/after remediation showcase.",
};

const themeInit = `(function(){try{var t=localStorage.getItem("novagait-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="flex min-h-screen flex-col antialiased">
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
