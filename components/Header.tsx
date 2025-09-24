import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, User, Bookmark } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-white">
            MovieRecom
          </Link>
          <nav className="flex gap-1">
            <Link href="/"><Button variant="ghost" size="icon" className="rounded-full"><Home className="size-5" /></Button></Link>
            <Link href="/search"><Button variant="ghost" size="icon" className="rounded-full"><Search className="size-5" /></Button></Link>
            <Link href="/saved"><Button variant="ghost" size="icon" className="rounded-full"><Bookmark className="size-5" /></Button></Link>
            <Link href="/profile"><Button variant="ghost" size="icon" className="rounded-full"><User className="size-5" /></Button></Link>
          </nav>
        </div>
      </div>
    </header>
  );
}