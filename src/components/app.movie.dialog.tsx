"use client";
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

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  movie: Movie;
}

export default function MovieDialog({ isOpen, setIsOpen, movie }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-black dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="aspect-w-16 aspect-h-9">
            <iframe
              className="w-full h-[400] rounded-md shadow-lg"
              src={movie.trailer_url}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 p-6 text-white">
          <div className="flex items-center">
            <img
              src={movie.poster_url}
              alt={movie.title}
              className="h-40 w-full object-cover rounded-md shadow-md"
            />
          </div>

          <div className="md:col-span-5 space-y-2">
            <h2 className="text-2xl font-semibold">{movie.title}</h2>
            <p className="text-sm text-gray-400">{movie.genre}</p>
            <p className="text-sm text-gray-300 leading-relaxed">
              {movie.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 px-6 py-4">
          {/* <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            I accept
          </button> */}
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}