import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "To-Do-List - Login",
  description:
    "Faça login para acessar suas tarefas e gerenciar seu dia a dia.",
  openGraph: {
    title: "To-Do-List - Login",
    description:
      "Faça login para acessar suas tarefas e gerenciar seu dia a dia.",
  },
};

export default function CancelarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
