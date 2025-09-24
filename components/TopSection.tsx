'use client';
import { useQuery } from "@tanstack/react-query";
import { getTrendingFilms } from "@/lib/tmdb";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function TopSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["trendingFilms"],
    queryFn: () => getTrendingFilms(),
    select: (data) => data.results.slice(0, 5),
  });

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

  const updateScrollState = () => {
    if (!scrollContainerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    const movieCard = scrollContainerRef.current.querySelector('.trending-card') as HTMLElement;
    if (movieCard) {
      const movieWidth = movieCard.offsetWidth + 16;
      scrollContainerRef.current.scrollBy({ left: -movieWidth, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    const movieCard = scrollContainerRef.current.querySelector('.trending-card') as HTMLElement;
    if (movieCard) {
      const movieWidth = movieCard.offsetWidth + 16;
      scrollContainerRef.current.scrollBy({ left: movieWidth, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (!autoScrollEnabled || !data || data.length <= 1) return;

    const interval = setInterval(() => {
      if (!scrollContainerRef.current) return;
      
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;

      if (scrollLeft >= scrollWidth - clientWidth - 10) {
        scrollContainerRef.current.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollRight();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoScrollEnabled, data]);

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    
    updateScrollState();
    scrollContainerRef.current.addEventListener('scroll', updateScrollState);
    
    return () => {
      scrollContainerRef.current?.removeEventListener('scroll', updateScrollState);
    };
  }, [data]);

  if (isLoading) return (
    <div className="flex justify-center py-12">
      <Loader2 className="animate-spin size-8 text-primary" />
    </div>
  );

  if (error) return (
    <p className="text-destructive text-center py-8">
      Error loading trending films
    </p>
  );

  return (
    <div 
      className="relative"
      onMouseEnter={() => {
        setShowArrows(true);
        setAutoScrollEnabled(false);
      }}
      onMouseLeave={() => {
        setShowArrows(false);
        setAutoScrollEnabled(true);
      }}
    >

      {showArrows && data && data.length > 1 && (
        <button
          onClick={scrollLeft}
          disabled={!canScrollLeft}
          className={`
            absolute left-4 top-1/2 transform -translate-y-1/2 z-10
            w-12 h-12 rounded-full glass-card flex items-center justify-center
            transition-all duration-300 border border-white/20
            ${canScrollLeft 
              ? 'hover:scale-110 hover:border-white/40 cursor-pointer opacity-100' 
              : 'opacity-50 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft className="size-6 text-white" />
        </button>
      )}

      {showArrows && data && data.length > 1 && (
        <button
          onClick={scrollRight}
          disabled={!canScrollRight}
          className={`
            absolute right-4 top-1/2 transform -translate-y-1/2 z-10
            w-12 h-12 rounded-full glass-card flex items-center justify-center
            transition-all duration-300 border border-white/20
            ${canScrollRight 
              ? 'hover:scale-110 hover:border-white/40 cursor-pointer opacity-100' 
              : 'opacity-50 cursor-not-allowed'
            }
          `}
        >
          <ChevronRight className="size-6 text-white" />
        </button>
      )}

      <div 
        ref={scrollContainerRef}
        className="top-films-container no-scrollbar"
        style={{ overflow: 'hidden' }}
      >
        {data?.map((item: any, idx: number) => (
          <Card 
            key={item.id} 
            className="trending-card group flex-shrink-0"
            style={{ minWidth: '280px' }}
          >
            <Link href={`/films/${item.id}`}>
              <div className="relative overflow-hidden rounded-lg">
                <Image
                  src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
                  alt={item.title}
                  width={280}
                  height={420}
                  className="aspect-[2/3] object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="font-semibold text-white text-lg mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Star className="size-4 fill-yellow-400 text-yellow-400" />
                    <span>{item.vote_average.toFixed(1)}</span>
                    <span>•</span>
                    <span>{item.release_date?.split('-')[0]}</span>
                  </div>
                </div>
              </div>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}