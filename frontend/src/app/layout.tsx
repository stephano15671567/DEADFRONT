import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { KeycloakProvider } from "@/providers/KeycloakProvider"; // <--- Importar Provider

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mi Testamento Digital",
  description: "Gestión de legado digital segura",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Envolvemos toda la app con el Provider de Seguridad */}
        <KeycloakProvider>
          {children}
        </KeycloakProvider>
      </body>
    </html>
  );
}