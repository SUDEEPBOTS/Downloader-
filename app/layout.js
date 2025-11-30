import "./globals.css";     // <<--- SABSE IMPORTANT LINE

export const metadata = {
  title: "YouTube Downloader",
  description: "Fast YouTube video & audio downloader",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
