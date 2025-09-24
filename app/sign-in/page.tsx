'use client'
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4">
        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
        <Button onClick={() => signIn("github")}>Sign in with GitHub</Button>
      </div>
    </div>
  );
}