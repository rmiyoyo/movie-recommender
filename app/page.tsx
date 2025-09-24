'use client'
import FilmItem from "@/components/FilmItem";
import SearchField from "@/components/SearchField";
import TopSection from "@/components/TopSection";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getFilms } from "@/lib/tmdb";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

export default function MainPage() {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error } = useInfiniteQuery({
    queryKey: ["popularFilms"],
    queryFn: ({ pageParam = 1 }) => getFilms({ page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page < last.total_pages ? last.page + 1 : undefined),
  });
  const handleSubmit = () => {
    if (term.trim()) router.push(`/search?term=${encodeURIComponent(term)}`);
  };
  const films = data?.pages.flatMap((p) => p.results) ?? [];
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-4">
            Discover Amazing Films
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Find your next favorite movie from our curated collection of popular and trending films.
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto mb-16">
          <SearchField value={term} onChange={setTerm} onSubmit={handleSubmit} />
        </div>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Trending Now</h2>
          <TopSection />
        </section>
        
        <section>
          <h2 className="text-3xl font-bold mb-8">Popular Films</h2>
          {isLoading && <div className="flex justify-center py-12"><Loader2 className="animate-spin size-8" /></div>}
          {error && <p className="text-destructive text-center py-8">Error loading films</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {films.map((film) => <FilmItem key={film.id} {...film} />)}
          </div>
          {hasNextPage && (
            <div className="flex justify-center mt-12">
              <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} size="lg" variant="outline">
                {isFetchingNextPage ? <Loader2 className="animate-spin size-4 mr-2" /> : null}
                Load More
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}