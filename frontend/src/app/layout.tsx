import type { Metadata } from "next";
import { AuthProvider } from "@/services/AuthService";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/dark-mode";
import "./globals.css";

export const metadata: Metadata = {
  title: "To-Do-List",
  description:
    "Gerencie suas tarefas diárias com facilidade. Crie, edite e exclua tarefas, defina prioridades e acompanhe seu progresso. Organize sua vida pessoal e profissional de forma eficiente.",
  openGraph: {
    title: "To-Do-List",
    description:
      "Gerencie suas tarefas diárias com facilidade. Crie, edite e exclua tarefas, defina prioridades e acompanhe seu progresso. Organize sua vida pessoal e profissional de forma eficiente.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <div className="fixed top-5 right-5 z-50">
              <ModeToggle />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
