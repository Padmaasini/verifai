import "./globals.css";

export const metadata = {
  title: "VerifAI — AI-Powered Background Verification",
  description: "Automated BGV for tech companies — powered by AI agents",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-800 font-sans">{children}</body>
    </html>
  );
}
