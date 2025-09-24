'use client'
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/lib/database";
import FilmItem from "@/components/FilmItem";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { data: favorites, isLoading, error } = useQuery({
    queryKey: ["favorites"],
    queryFn: () => getFavorites(session?.user?.email!),
    enabled: !!session,
  });
  if (status === "loading") return <Loader2 className="animate-spin mx-auto mt-20" />;
  if (!session) {
    router.push("/sign-in");
    return null;
  }
  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold my-6">Favorites</h2>
        {isLoading ? <Loader2 className="animate-spin mx-auto" /> : null}
        {error ? <p className="text-destructive">Error: {error.message}</p> : null}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {favorites?.map((fav: any) => <FilmItem key={fav.filmId} id={fav.filmId} title={fav.title} poster_path={fav.poster_path} vote_average={fav.vote_average} release_date={fav.release_date} />)}
        </div>
        {!favorites?.length && !isLoading ? <p className="text-center text-muted-foreground">No favorites yet.</p> : null}
      </div>
    </div>
  );
}