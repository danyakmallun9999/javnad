import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JAVAnad - Monad Testnet Explorer",
  description: "Powerful on-chain analytics and exploration tools for the Monad testnet. Discover wallets, transactions, tokens, and NFTs with ease.",
  keywords: ["Monad", "blockchain", "explorer", "wallet", "NFT", "tokens", "testnet", "crypto", "analytics"],
  authors: [{ name: "IPVDAN", url: "https://twitter.com/ipvdan" }],
  creator: "IPVDAN",
  publisher: "JAVAnad",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://javanad.vercel.app'), // Update with your actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "JAVAnad - On-chain analytics",
    description: "Powerful on-chain analytics and exploration tools for the Monad testnet. Discover wallets, transactions, tokens, and NFTs with ease.",
    url: 'https://javanad.vercel.app', // Update with your actual domain
    siteName: 'JAVnad',
    images: [
      {
        url: '/images/javanad.png',
        width: 1200,
        height: 630,
        alt: 'JAVAnad - On-chain analytics',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "JAVAnad - On-chain analytics",
    description: "Powerful on-chain analytics and exploration tools for the Monad testnet. Discover wallets, transactions, tokens, and NFTs with ease.",
    creator: '@ipvdan',
    images: ['/images/javanad.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add if you have Google Search Console
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
