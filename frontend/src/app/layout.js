import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../app/_layouts/header/Index";
import Footer from "../app/_layouts/footer/Index";
import Script from 'next/script';
import AppData from "../data/app.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
		default: AppData.settings.siteName,
		template: "%s | " + AppData.settings.siteName,
	},
  description: "A site for Vietnamese cubing association, organization, and community",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Header />
        {/* <div className="scroll-sensor"></div> */}
        <main className="page-content">{children}</main>
        <Footer />

        <Script id="navbar-scroll-handler" strategy="afterInteractive">
          {`
            window.addEventListener('scroll', () => {
              const navbar = document.getElementById("navbar");
              if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
              }
            });
          `}
        </Script>
      </body>
    </html>
  );
}
