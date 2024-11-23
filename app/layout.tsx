// app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Script from 'next/script';
import Head from 'next/head'; // Ensure Head is imported if needed

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const DOMAIN = process.env.SITE_URL;

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FastAPI Initializer",
  description: "Make it easy to create FastAPI projects",
  keywords: ["FastAPI", "Project Generator", "Web Tool", "Python", "Backend Framework"],
  openGraph: {
    title: "FastAPI Initializer",
    description: "Make it easy to create FastAPI projects",
    url: DOMAIN,
    siteName: "FastAPI Initializer",
    images: [
      {
        url: `${DOMAIN}/images/fastapi-initializer.webp`,
        width: 1200,
        height: 630,
        alt: "FastAPI Initializer OG Image",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastAPI Initializer",
    description: "Make it easy to create FastAPI projects",
    images: [`${DOMAIN}/images/fastapi-initializer.webp`], // Optional separate image for Twitter
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Google Tag Manager */}
        {GTM_ID && (
          <Script
            id="gtm-script"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){
                w[l]=w[l]||[];
                w[l].push({'gtm.start': new Date().getTime(), event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                    j=d.createElement(s),
                    dl=l!='dataLayer'?'&l='+l:'';
                j.async=true;
                j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
                f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
        {/* Structured Data, Additional Meta Tags, etc. */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager (noscript) */}
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            ></iframe>
          </noscript>
        )}
        {children}
        {/* Footer */}
        <footer className="bg-white shadow-md p-4 flex justify-center space-x-6">
          <a
            href="https://github.com/jts8257/fastapi-initializer"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
          >
            {/* GitHub SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 .5C5.648.5.5 5.648.5 12c0 5.093 3.292 9.415 7.863 10.958.575.105.785-.25.785-.56 0-.276-.01-1.006-.015-1.97-3.2.696-3.88-1.544-3.88-1.544-.522-1.33-1.28-1.688-1.28-1.688-1.04-.711.08-.696.08-.696 1.152.081 1.76 1.183 1.76 1.183 1.022 1.75 2.687 1.245 3.342.952.104-.741.4-1.245.727-1.533-2.56-.291-5.244-1.28-5.244-5.695 0-1.259.45-2.289 1.185-3.096-.12-.292-.515-1.465.114-3.054 0 0 .966-.309 3.17 1.18a10.92 10.92 0 012.89-.388c.978.005 1.96.132 2.89.388 2.204-1.489 3.17-1.18 3.17-1.18.63 1.589.236 2.762.116 3.054.74.807 1.185 1.837 1.185 3.096 0 4.424-2.69 5.4-5.25 5.685.41.354.775 1.05.775 2.117 0 1.53-.014 2.764-.014 3.135 0 .313.206.67.79.56A12.504 12.504 0 0023.5 12c0-6.352-5.148-11.5-12-11.5z" />
            </svg>
            GitHub
          </a>
          <a
            href="mailto:k.jts8257@example.com"
            className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
          >
            {/* Email SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 13.065L2 6.25V17.75A1.75 1.75 0 003.75 19.5H20.25A1.75 1.75 0 0022 17.75V6.25L12 13.065zM12 5.75L22 12.565V4.5A1.75 1.75 0 0020.25 2.75H3.75A1.75 1.75 0 002 4.5V12.565L12 5.75z" />
            </svg>
            Email
          </a>
        </footer>
      </body>
    </html>
  );
}
