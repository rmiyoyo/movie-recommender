export interface Favorite {
  filmId: number;
  title: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
}

export interface DatabaseFavorite {
  filmId: number;
  title: string;
  poster_path?: string;
  posterUrl?: string;
  vote_average: number;
  release_date: string;
}