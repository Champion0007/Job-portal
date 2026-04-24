import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../components/AuthContext";
import { LoadingProvider } from "../components/LoadingContext";
import LoadingOverlay from "../components/LoadingOverlay";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Job Portal",
  description: "Job portal built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <LoadingProvider>
          <AuthProvider>
            {children}
            <LoadingOverlay />
          </AuthProvider>
        </LoadingProvider>
      </body>
    </html>
  );
}
