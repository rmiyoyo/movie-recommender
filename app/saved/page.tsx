'use client'
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { getFavorites } from "@/lib/database";
import FilmItem from "@/components/FilmItem";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface Favorite {
  filmId: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

interface DatabaseFavorite {
  filmId: number;
  title: string;
  poster_path?: string;
  posterUrl?: string;
  vote_average: number;
  release_date: string;
}

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { data: favorites, isLoading, error } = useQuery<Favorite[]>({
    queryKey: ["favorites", session?.user?.email],
    queryFn: async () => {
      if (!session?.user?.email) throw new Error("No user email");
      const data = await getFavorites(session.user.email);
      return data.map((doc: any) => ({
        filmId: doc.filmId,
        title: doc.title,
        poster_path: doc.poster_path ?? doc.posterUrl ?? "",
        vote_average: doc.vote_average,
        release_date: doc.release_date,
      }));
    },
    enabled: !!session?.user?.email,
  });

  if (status === "loading") return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin size-12" /></div>;
  
  if (!session) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8">My Favorites</h2>
        {isLoading && <div className="flex justify-center py-12"><Loader2 className="animate-spin size-8" /></div>}
        {error && <p className="text-destructive text-center py-8">Error loading favorites</p>}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {favorites?.map((fav: Favorite) => (
            <FilmItem 
              key={fav.filmId} 
              id={fav.filmId} 
              title={fav.title} 
              poster_path={fav.poster_path} 
              vote_average={fav.vote_average} 
              release_date={fav.release_date} 
            />
          ))}
        </div>
        {!favorites?.length && !isLoading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No favorites yet.</p>
            <p className="text-muted-foreground">Start adding movies to your favorites!</p>
          </div>
        )}
      </div>
    </div>
  );
}
