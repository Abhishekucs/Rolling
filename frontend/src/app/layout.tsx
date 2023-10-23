import "../styles/globals.css";
import type { Metadata } from "next";
import { ReduxProvider } from "@/components/provider";
import Banner from "@/components/banner";
import Header from "@/components/header";
import AuthProvider from "@/components/AuthProvider";
import { Footer } from "@/components/footer";
import ToastProvider from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "Rolling | Luxury Streetwear Brand",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ToastProvider>
            <AuthProvider>
              <Banner />
              <Header />
              {children}
              <Footer />
            </AuthProvider>
          </ToastProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
