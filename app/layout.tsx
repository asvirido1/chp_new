import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CHPOK - Система контроля нарушений в городе",
  description: "Анонимная система фиксации нарушений в городе. Фотографируй, указывай детали и отправляй чпок!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        {children}
      </body>
    </html>
  );
}

