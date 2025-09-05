import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import Header from "@/app/_layouts/header/Index";
import Footer from "@/app/_layouts/footer/Index";
import AppData from "@/data/app.json";
import { Provider } from "@/app/provider";

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

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const personAccessToken = cookieStore.get("person_session")?.value;
  const organiserAccessToken = cookieStore.get("organiser_session")?.value;

  const isLoggedInPerson = !!personAccessToken;
  const isLoggedInOrganiser = !!organiserAccessToken;

  return (
    <html lang="vi">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Provider isLoggedInPerson={isLoggedInPerson} isLoggedInOrganiser={isLoggedInOrganiser}>       
          <Header />
          <main>
              <div className="page-content">{children}</div>
          </main>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}