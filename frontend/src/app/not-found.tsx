"use client";
import { useAuth } from "@/services/AuthService";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
    <>
      <div>
        <h1>NotFound</h1>
      </div>
      <Link href="/" className="text-blue-500 hover:underline">
        Voltar para a página inicial
      </Link>
    </>
  );
}
