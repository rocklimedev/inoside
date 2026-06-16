import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppProviders from "@/providers/AppProviders";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ),

  title: {
    default: "BUILDCON ERP",
    template: "%s | BUILDCON ERP",
  },

  description:
    "Construction ERP platform for project planning, approvals, execution, vendor management, inventory, quality tracking, and project handover.",

  keywords: [
    "construction ERP",
    "project management",
    "architecture",
    "site management",
    "vendor management",
    "BOQ",
    "design approval",
    "inventory tracking",
    "construction workflow",
  ],

  authors: [{ name: "BUILDCON" }],
  creator: "BUILDCON",
  publisher: "BUILDCON",

  applicationName: "BUILDCON ERP",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "BUILDCON ERP",
    title: "BUILDCON ERP",
    description:
      "Modern construction ERP platform for managing projects, approvals, execution, and operations.",
    images: [
      {
        url: "/og-image.png", // place inside /public
        width: 1200,
        height: 630,
        alt: "BUILDCON ERP",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "BUILDCON ERP",
    description: "Construction ERP platform for project lifecycle management.",
    images: ["/og-image.png"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#dc2626",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
