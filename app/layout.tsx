import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Salão Sandra Pipoquinha",
  description: "Agende seu corte com praticidade!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-pink-50 text-gray-900 min-h-screen font-sans">
        <header className="bg-white shadow-md py-6 px-8 border-b border-pink-200">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
  <img src="/images/logo.png" alt="Logo do salão" className="h-12 w-auto rounded-md" />
  <span className="text-2xl font-bold text-rose-600">Salão Sandra Pipoquinha</span>
</div>

            <nav className="space-x-6 text-rose-600 font-medium text-base">
              <Link href="/">Início</Link>
              <Link href="/servicos">Serviços</Link>
              <Link href="/agendar">Agendar</Link>
              <Link href="/reservas">Reservas</Link>
              <Link href="/login">Login</Link>
              <Link href="/admin">Painel</Link>
            </nav>
          </div>
        </header>
        <main className="p-6 max-w-6xl mx-auto">{children}</main>
      </body>
    </html>
  );
}
