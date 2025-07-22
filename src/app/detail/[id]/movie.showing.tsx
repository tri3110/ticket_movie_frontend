import { useDataStore } from "@/utils/store";
import { StarIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";

export default function MovieShowing(){
    const {getFilteredMovieByStatus} = useDataStore();
    const moviesShowing = getFilteredMovieByStatus("showing");
    const router = useRouter();

    return (
        <>
        {
            moviesShowing.map((movie)=>(
                <div 
                    key={movie.id} 
                    onClick={()=> {
                        router.push("/detail/" + movie.id);
                    }} 
                    className="grid grid-cols-1 md:grid-cols-5 gap-2 py-2 cursor-pointer border-b border-gray-200">
                    <div className="flex">
                        <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="h-22 w-full object-cover rounded-md shadow-md"
                        />
                    </div>

                    <div className="md:col-span-4 space-y-2">
                        <h2 className="text-sm font-semibold">{movie.title}</h2>
                        <p className="text-sm text-gray-400">{movie.genre}</p>
                    </div>
                </div>
            ))
        }
        </>
    )
}