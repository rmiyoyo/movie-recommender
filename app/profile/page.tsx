'use client'
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import Header from "@/components/Header";
export default function UserPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") return <Loader2 className="animate-spin mx-auto mt-20" />;
  if (!session) {
    router.push("/sign-in");
    return null;
  }
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold">{session.user?.name}</h1>
        <p className="text-muted-foreground">{session.user?.email}</p>
        <Button onClick={() => signOut({ callbackUrl: "/sign-in" })} variant="destructive" className="mt-8">Sign Out</Button>
      </div>
    </div>
  );
}