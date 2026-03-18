import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://weeding-lilac.vercel.app"),
  title: "The Wedding of Uut Kusfendi & Nabila Avira Fitri",
  description: "Undangan pernikahan Uut Kusfendi dan Nabila Avira Fitri pada Minggu, 12 April 2026 di Balai Samudra, Jakarta.",
  openGraph: {
    title: "The Wedding of Uut Kusfendi & Nabila Avira Fitri",
    description: "Undangan pernikahan Uut Kusfendi dan Nabila Avira Fitri pada Minggu, 12 April 2026 di Balai Samudra, Jakarta.",
    url: "https://weeding-lilac.vercel.app",
    siteName: "The Wedding of Uut & Nabila",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "/images/Uut-Weeding.png",
        width: 1200,
        height: 1600,
        alt: "The Wedding of Uut Kusfendi & Nabila Avira Fitri"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "The Wedding of Uut Kusfendi & Nabila Avira Fitri",
    description: "Undangan pernikahan Uut Kusfendi dan Nabila Avira Fitri pada Minggu, 12 April 2026 di Balai Samudra, Jakarta.",
    images: ["/images/Uut-Weeding.png"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
