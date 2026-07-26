import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
