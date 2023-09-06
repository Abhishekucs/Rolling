import "./globals.css";
import type { Metadata } from "next";
import { Providers } from "@/init/provider";
import Banner from "@/components/banner";

export const metadata: Metadata = {
  title: "Rolling | Luxury Streetwear Brand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Banner />
          {children}
        </Providers>
      </body>
    </html>
  );
}
