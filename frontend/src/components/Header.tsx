"use client";

import { Button } from "@/components/ui/button";

export default function Header({ user, logout }: HeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-4 border-b">
      <h1 className="text-4xl font-bold mb-4 sm:mb-0">
        Olá, {user?.username || "Usuário"}!
      </h1>
      <Button variant="destructive" onClick={logout}>
        Sair
      </Button>
    </header>
  );
}
