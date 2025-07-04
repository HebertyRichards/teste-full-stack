import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "To-Do-List - Registro",
  description:
    "Registre-se na melhor plataforma de gerenciador de tarefas. Crie uma conta para começar a organizar suas atividades diárias.",
  openGraph: {
    title: "To-Do-List - Registro",
    description:
      "Registre-se na melhor plataforma de gerenciador de tarefas. Crie uma conta para começar a organizar suas atividades diárias",
  },
};

export default function CancelarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
