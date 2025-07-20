import { useDataStore } from "@/utils/store";
import { MagnifyingGlassIcon, StarIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AppSearch(){
    const {t} = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [valueSearch, setValueSearch] = useState("");

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    };

    const { getFilteredMovies } = useDataStore();
    const movies = getFilteredMovies(valueSearch);

    return (
        <div className="riva hidden md:flex items-center overflow-hidden">
            
            <button className="px-3 py-1 text-gray-600 text-sm" onClick={()=>setIsOpen(!isOpen)}>
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 hover:text-gray-800" />
            </button>
            {
                isOpen && 
                <div onClick={handleBackdropClick} className="fixed top-[7%] inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="absolute top-1 right-4 w-full max-w-sm bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                        <div className="p-3 border-b border-gray-200">
                            <div className="relative flex items-center aspect-w-16 aspect-h-9 border border-gray-200 rounded-lg">
                                <MagnifyingGlassIcon className="absolute left-1 h-6 w-6 text-gray-600 hover:text-gray-800" />
                                <input
                                    type="text"
                                    placeholder={t("Enter movie name")}
                                    className="w-full pl-8 px-3 py-2 text-sm text-gray-800 dark:text-white bg-transparent outline-none"
                                    onChange={(e)=>{
                                        setValueSearch(e.target.value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="h-[400px] overflow-y-auto">
                        {
                            movies.map((movie)=> (
                                <div key={movie.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 cursor-pointer border-b border-gray-200">
                                    <div className="flex items-center">
                                        <img
                                        src={movie.poster_url}
                                        alt={movie.title}
                                        className="h-22 w-full object-cover rounded-md shadow-md"
                                        />
                                    </div>

                                    <div className="md:col-span-4 space-y-2">
                                        <h2 className="text-sm font-semibold">{movie.title}</h2>
                                        <p className="text-sm text-gray-400">{movie.genre}</p>
                                        {
                                            movie.rating &&
                                            <span className="py-1 flex items-center gap-1">
                                                <StarIcon className="pb-1 h-5 w-5 text-yellow-500" /> {movie.rating}
                                            </span>
                                        }
                                    </div>
                                </div>
                            ))
                        }
                        </div>
                        
                    </div>
                </div>
            }
        </div>
    )
} 