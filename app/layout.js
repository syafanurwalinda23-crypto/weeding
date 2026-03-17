import "./globals.css";

export const metadata = {
  title: "Undangan Pernikahan Sample",
  description: "Template undangan pernikahan digital dengan countdown, maps, komentar, musik, dan QR hadiah."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
