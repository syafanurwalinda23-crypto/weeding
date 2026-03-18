import "./globals.css";

export const metadata = {
  title: "The Wedding of Uut Kusfendi & Nabila Avira Fitri",
  description: "Undangan pernikahan Uut Kusfendi dan Nabila Avira Fitri pada Minggu, 12 April 2026 di Balai Samudra, Jakarta."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
