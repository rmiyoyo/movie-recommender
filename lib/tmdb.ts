const BASE_URL = "https://api.themoviedb.org/3";
const HEADERS = {
  accept: "application/json",
  Authorization: `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
};

export async function getFilms({ query = "", page = 1 }: { query?: string; page?: number }) {
  const path = query ? `/search/movie?query=${encodeURIComponent(query)}&page=${page}` : `/discover/movie?page=${page}&sort_by=popularity.desc`;
  const res = await fetch(`${BASE_URL}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error("Failed to fetch films");
  return res.json();
}

export async function getFilmInfo(id: number) {
  const res = await fetch(`${BASE_URL}/movie/${id}`, { headers: HEADERS });
  if (!res.ok) throw new Error("Failed to fetch film info");
  return res.json();
}

export async function getTrendingFilms({ page = 1 }: { page?: number } = {}) {
  const path = `/trending/movie/day?page=${page}`;
  const res = await fetch(`${BASE_URL}${path}`, { headers: HEADERS });
  if (!res.ok) throw new Error("Failed to fetch trending films");
  return res.json();
}