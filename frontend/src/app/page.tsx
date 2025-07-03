"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/services/AuthService";
import Link from "next/link";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <>
      <h1>To do List</h1>
      <div className="mt-4">{user && <p>Bem-vindo, {user.username}!</p>}</div>
      <div className="mt-4">
        <Link href="/tasks" className="text-blue-500 hover:underline">
          Ver Tarefas
        </Link>
      </div>
      <div className="mt-4">
        <Link
          href="/logout"
          className="text-blue-500 hover:underline"
          onClick={handleLogout}
        >
          Sair
        </Link>
      </div>
    </>
  );
}
