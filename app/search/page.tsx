'use client'
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { getFilms } from "@/lib/tmdb";
import { updateCount } from "@/lib/database";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import FilmItem from "@/components/FilmItem";
import SearchField from "@/components/SearchField";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { Film } from "@/types/interfaces";

export default function SearchPage() {
  const params = useSearchParams();
  const term = params.get("term") || "";
  const [input, setInput] = useState(term);
  const router = useRouter();
  
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, refetch } = useInfiniteQuery({
    queryKey: ["searchFilms", term],
    queryFn: ({ pageParam = 1 }) => getFilms({ query: term, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.total_pages ? last.page + 1 : undefined),
    enabled: !!term,
  });

  const countUpdate = useMutation({ 
    mutationFn: (film: Film) => updateCount(term, film) 
  });

  useEffect(() => {
    if (data?.pages[0]?.results[0]) {
      countUpdate.mutate(data.pages[0].results[0]);
    }
  }, [data]);

  const handleSubmit = () => {
    if (input.trim()) {
      router.push(`/search?term=${encodeURIComponent(input)}`);
    }
  };

  const films = data?.pages.flatMap((p) => p.results) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <SearchField value={input} onChange={setInput} onSubmit={handleSubmit} />
        </div>
        
        {term && (
          <h2 className="text-2xl font-semibold mb-6 gradient-text">
            Results for "{term}"
          </h2>
        )}
        
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin size-8 text-primary" />
          </div>
        )}
        
        {error && (
          <p className="text-destructive text-center py-8">
            Error: {error.message}
          </p>
        )}
        
        <div className="film-grid">
          {films.map((film) => (
            <FilmItem key={film.id} {...film} />
          ))}
        </div>
        
        {hasNextPage && (
          <div className="flex justify-center mt-8">
            <Button 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage} 
              className="gradient-button"
            >
              {isFetchingNextPage ? (
                <Loader2 className="animate-spin size-4 mr-2" />
              ) : null}
              {isFetchingNextPage ? "Loading..." : "Load More"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}