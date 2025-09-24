export interface Film {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
}

export interface TopFilm {
  $id: string;
  searchTerm: string;
  filmId: number;
  title: string;
  count: number;
  posterUrl: string;
}

export interface FilmInfo extends Film {
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number;
  backdrop_path: string | null;
}