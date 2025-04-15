import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "Vote DeCentral",
    template: "%s | Vote DeCentral"
  },
  description: "A transparent and secure way to participate in elections using blockchain technology",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0f172a" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" }
  ],
  openGraph: {
    images: "/og-image.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} scroll-smooth`} suppressHydrationWarning>
      <body className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 antialiased">
        {/* Animated background elements */}
        <div className="fixed inset-0 -z-50 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl animate-gradient"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 rounded-full bg-purple-500/20 blur-3xl animate-gradient animation-delay-2000"></div>
        </div>
        
        {/* Main content */}
        <main className="relative z-10">
          {children}
        </main>
        
        {/* Global loading indicator */}
        <div id="global-loader"></div>
      </body>
    </html>
  );
}