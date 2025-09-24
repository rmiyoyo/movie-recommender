import { Client, Databases, ID, Query } from "appwrite";
import { Film, FilmInfo, TopFilm } from "@/types/interfaces";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const db = new Databases(client);
const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const SEARCH_COLL = process.env.NEXT_PUBLIC_APPWRITE_SEARCHES_COLLECTION_ID!;
const FAV_COLL = process.env.NEXT_PUBLIC_APPWRITE_FAVORITES_COLLECTION_ID!;

export async function getTopFilms() {
  const res = await db.listDocuments(DB_ID, SEARCH_COLL, [Query.orderDesc("count"), Query.limit(5)]);
  return res.documents.map((doc) => ({
    searchTerm: doc.searchTerm,
    filmId: doc.filmId,
    title: doc.title,
    count: doc.count,
    posterUrl: doc.posterUrl,
  })) as TopFilm[];
}

export async function updateCount(term: string, film: Film) {
  const res = await db.listDocuments(DB_ID, SEARCH_COLL, [Query.equal("searchTerm", term), Query.equal("filmId", film.id)]);
  if (res.documents.length > 0) {
    const doc = res.documents[0];
    await db.updateDocument(DB_ID, SEARCH_COLL, doc.$id, { count: doc.count + 1 });
  } else {
    await db.createDocument(DB_ID, SEARCH_COLL, ID.unique(), {
      searchTerm: term,
      filmId: film.id,
      title: film.title,
      count: 1,
      posterUrl: `https://image.tmdb.org/t/p/w500${film.poster_path}`,
    });
  }
}

export async function getFavorites(userId: string) {
  const res = await db.listDocuments(DB_ID, FAV_COLL, [Query.equal("userId", userId)]);
  return res.documents;
}

export async function checkIfFavorite(filmId: number, userId: string) {
  const res = await db.listDocuments(DB_ID, FAV_COLL, [Query.equal("userId", userId), Query.equal("filmId", filmId)]);
  return res.documents.length > 0;
}

export async function addFavorite(film: FilmInfo, userId: string) {
  await db.createDocument(DB_ID, FAV_COLL, ID.unique(), {
    filmId: film.id,
    title: film.title,
    poster_path: film.poster_path,
    vote_average: film.vote_average,
    release_date: film.release_date,
    userId,
  });
}

export async function removeFavorite(filmId: number, userId: string) {
  const res = await db.listDocuments(DB_ID, FAV_COLL, [Query.equal("userId", userId), Query.equal("filmId", filmId)]);
  if (res.documents.length > 0) await db.deleteDocument(DB_ID, FAV_COLL, res.documents[0].$id);
}