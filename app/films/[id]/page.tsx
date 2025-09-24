'use client'
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFilmInfo } from "@/lib/tmdb";
import { addFavorite, removeFavorite, checkIfFavorite } from "@/lib/database";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Bookmark, ArrowLeft, Star, Clock } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
export default function FilmPage() {
  const { id } = useParams();
  const filmId = parseInt(id as string);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: film, isLoading, error } = useQuery({
    queryKey: ["filmInfo", filmId],
    queryFn: () => getFilmInfo(filmId),
  });
  const userId = (session?.user as { id?: string })?.id;
  const { data: favored } = useQuery({
    queryKey: ["fav", filmId],
    queryFn: () => checkIfFavorite(filmId, userId!),
    enabled: !!session && !!userId,
  });
  const toggleFav = useMutation({
    mutationFn: () => favored ? removeFavorite(filmId, userId!) : addFavorite(film!, userId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fav", filmId] });
      queryClient.invalidateQueries({ queryKey: ["favorites"] });
    },
  });
  if (isLoading) return <div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin size-12" /></div>;
  if (error || !film) return <div className="flex justify-center items-center min-h-screen"><p className="text-destructive text-xl">Error loading film</p></div>;
  type Genre = { id: number; name: string };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button onClick={() => router.back()} variant="ghost" className="mb-8 gap-2">
          <ArrowLeft className="size-4" />
          Back
        </Button>
        
        <div className="relative rounded-2xl overflow-hidden mb-8">
          <Image 
            src={`https://image.tmdb.org/t/p/original${film.backdrop_path || film.poster_path}`} 
            alt={film.title} 
            width={1920} 
            height={1080} 
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/3">
            <Image 
              src={`https://image.tmdb.org/t/p/w500${film.poster_path}`} 
              alt={film.title} 
              width={400} 
              height={600} 
              className="rounded-2xl shadow-2xl w-full"
            />
          </div>
          
          <div className="lg:w-2/3">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{film.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Star className="size-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{film.vote_average.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-5" />
                <span>{film.runtime} min</span>
              </div>
              <span>{film.release_date?.split('-')[0]}</span>
            </div>
            
            <p className="text-lg leading-relaxed mb-6">{film.overview}</p>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {film.genres.map((g: Genre) => (
                <span key={g.id} className="px-4 py-2 bg-primary/10 text-primary rounded-full font-medium">
                  {g.name}
                </span>
              ))}
            </div>
            
            {session && (
              <Button onClick={() => toggleFav.mutate()} size="lg" className="gap-2">
                <Bookmark className={`size-5 ${favored ? "fill-current" : ""}`} />
                {favored ? "Remove from Favorites" : "Add to Favorites"}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}