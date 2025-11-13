import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VibeCode - Recruitment Platform",
  description: "Find your dream job with VibeCode recruitment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className="antialiased">
        <nav className="bg-blue-600 text-white shadow-lg">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <a href="/" className="text-2xl font-bold">
                VibeCode Recruitment
              </a>
              <div className="space-x-6">
                <a href="/" className="hover:text-blue-200 transition">
                  Home
                </a>
                <a href="/jobs" className="hover:text-blue-200 transition">
                  Jobs
                </a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">{children}</main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>&copy; 2025 VibeCode. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
