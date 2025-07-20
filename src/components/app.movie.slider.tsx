"use client";

import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import MovieDialog from "./app.movie.dialog";

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

interface themeStyle {
    text: string;
}

interface Props {
    movies: Movie[];
    themeStyle: themeStyle;
}

export default function AppSlider(props: Props) {
    const {movies, themeStyle} = props;
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<Movie>(movies[0]);

    const [sliderInstanceRef, slider] = useKeenSlider({
        loop: true,
        slides: {
            perView: 5,
            spacing: 22,
        },
        breakpoints: {
            "(max-width: 768px)": {
                slides: {
                    perView: 2,
                    spacing: 22,
                },
            },
        },
    });

    const formatDate = (date: string) => {
        const newDate = new Date(date);
        return new Intl.DateTimeFormat('vi-VN').format(newDate);
    }

    return (
        <div ref={sliderInstanceRef} className="keen-slider py-4">
            {movies.map((movie, index) => (
                <div key={index} className="keen-slider__slide">
                    <div className="rounded-lg overflow-hidden ">
                        {/* {film.status != "" && 
                            <span className="absolute top-2 left-1 bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded">
                                {film.status}
                            </span>
                        } */}
                        <div className="relative">
                            <img
                                src={movie.poster_url}
                                alt={movie.title}
                                className="w-full h-72 object-cover cursor-pointer"
                            />
                            
                            {/* Nút Play nằm giữa ảnh */}
                            <button
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    p-3 bg-transparent border-2 border-white text-white rounded-full
                                    hover:bg-white/10 transition duration-200 cursor-pointer"
                                onClick={()=>{
                                        setIsOpenDialog(true);
                                        setSelectedMovie(movie);
                                    }}
                            >
                                <svg className="h-6 w-6 fill-white" viewBox="0 0 20 20">
                                    <path d="M6 4l10 6-10 6V4z" />
                                </svg>
                            </button>
                        </div>
                        <div className="group cursor-pointer">
                            <div className={`text-xl truncate py-2 text-center text-sm font-medium ${themeStyle.text} group-hover:text-pink-400 `}>
                                {movie.title}
                            </div>
                            <div className="truncate text-xs text-tiny leading-tight text-gray-400 group-hover:text-pink-400">
                                {movie.genre}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <span className="py-1 text-xs text-tiny leading-tight text-gray-400">
                                {formatDate(movie.release_date)}
                            </span>
                            {
                                movie.rating &&
                                <span className="py-1 flex items-center justify-center gap-1 text-xs text-tiny leading-tight text-gray-400">
                                    <StarIcon className="h-4 w-4 text-yellow-500" /> {movie.rating}
                                 </span>
                            }
                            
                        </div>
                    </div>
                </div>
            ))}
            <button
                onClick={() => slider.current?.prev()}
                className="absolute left-1 top-1/2 -translate-y-1/2 bg-white dark:bg-blue-700 text-black dark:text-white px-1 py-3 rounded-full shadow-md hover:bg-blue-400 z-10"
            >
                <ChevronLeftIcon className="h-5 w-5" />
            </button>

            <button
                onClick={() => slider.current?.next()}
                className="absolute right-1 top-1/2 -translate-y-1/2 bg-white dark:bg-blue-700 text-black dark:text-white px-1 py-3 rounded-full shadow-md hover:bg-blue-400 z-10"
            >
                <ChevronRightIcon className="h-5 w-5" />
            </button>

            <MovieDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} movie={selectedMovie}/>

        </div>
    );
}