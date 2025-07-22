import { create } from 'zustand';

interface DataStore {
  data: {
    movies: Movie[];
    cities: City[];
    cinemas: Cinema[];
  } | null;
  setData: (data: any) => void;
  getFilteredMovies: (search: string) => Movie[];
  getFilteredCinemasById: (id: number, search: string, limit: number) => Cinema[];
  getFilteredMovieById: (id: number) => Movie | null;
  getFilteredMovieByStatus: (status: string) => Movie[];
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

  getFilteredMovieById: (id: number) => {
    const data = get().data;
    if (!data) return null;
    const movie = data.movies.find((m) => m.id === id);
    return movie ?? null;
  },

  getFilteredMovieByStatus: (status: string) => {
    const data = get().data;
    if (!data) return [];

    const movie = data.movies.filter((m) => m.status === status);
    return movie.slice(0, 10);
  },

}));