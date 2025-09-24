import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
interface Props {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}
export default function FilmItem({ id, title, poster_path, vote_average, release_date }: Props) {
  return (
    <Link href={`/films/${id}`}>
      <Card className="overflow-hidden border-0 bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:scale-105 hover:shadow-xl group">
        <div className="relative overflow-hidden">
          <Image 
            src={`https://image.tmdb.org/t/p/w500${poster_path || "/placeholder.svg"}`} 
            alt={title} 
            width={500} 
            height={750} 
            className="aspect-[2/3] object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1 text-sm font-semibold">
            <Star className="size-3 fill-yellow-400 text-yellow-400" />
            {vote_average.toFixed(1)}
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-muted-foreground text-sm">{release_date.split("-")[0]}</p>
        </CardContent>
      </Card>
    </Link>
  );
}