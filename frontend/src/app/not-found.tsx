"use client";
import { useAuth } from "@/services/AuthService";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function NotFound() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center min-h-screen p-6">
      <Alert variant="destructive" className="max-w-lg w-full">
        <AlertTitle className="text-2xl font-bold">
          Erro 404: Página Não Encontrada
        </AlertTitle>
        <AlertDescription className="mt-4">
          <p className="mb-4">
            Oops! O endereço que você está tentando acessar não existe ou foi
            removido.
          </p>
          <Button asChild>
            <Link href="/">Voltar para a Página Inicial</Link>
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
}
