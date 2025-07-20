import { create } from 'zustand';

interface Movie {
    id: number;
    title: string;
    status: string;
    duration: number;
    poster_url: string;
    rating: string;
    movie_cast: string;
    description: string;
    director: string;
    genre: string;
    release_date: string;
    trailer_url: string;
}

interface City {
    id: number;
    name: string;
    country: string;
}

interface Cinema {
    id: number;
    name: string;
    address: string;
    phone: string;
    opening_hours: string;
    city: number;
}

interface DataStore {
  data: {
    movies: Movie[];
    cities: City[];
    cinemas: Cinema[];
  } | null;
  setData: (data: any) => void;
  getFilteredMovies: (search: string) => Movie[];
  getFilteredCinemasById: (id: number, search: string, limit: number) => Cinema[];
}

export const useDataStore = create<DataStore>((set, get) => ({
  data: null,
  setData: (data) => set({ data }),

  getFilteredMovies: (search: string) => {
    const data = get().data;
    if (!data) return [];

    const lowerSearch = search.toLowerCase();
    return data.movies.filter((movie) =>
      movie.title.toLowerCase().includes(lowerSearch)
    ).slice(0, 10);
  },

  getFilteredCinemasById: (id: number, search: string, limit: number) => {
    const data = get().data;
    if (!data) return [];

    const lowerSearch = search.toLowerCase();
    return data.cinemas.filter((cinema) =>
      cinema.city == id && cinema.name.toLowerCase().includes(lowerSearch)
    ).slice(0, limit);
  },

}));