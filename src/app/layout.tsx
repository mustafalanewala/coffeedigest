import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "CoffeeDigest - Your Daily News with a Rich Brew",
  description:
    "CoffeeDigest brings you the latest news, perfectly brewed and served fresh. Stay informed with our rich blend of stories from around the world.",
  keywords:
    "news, coffee news, business, technology, sports, world, economy, politics, general, coffeedigest",
  authors: [{ name: "CoffeeDigest Editorial Team" }],
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-white">
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
