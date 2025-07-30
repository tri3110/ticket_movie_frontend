'use client'

import MovieDialog from "@/components/app.movie.dialog";
import AppMovieSchedule from "@/components/app.movie.schedule";
import { useDataStore } from "@/utils/store";
import { ChevronRightIcon, HomeIcon, StarIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { use, useState } from "react";
import { useTranslation } from "react-i18next";
import MovieShowing from "./movie.showing";


export default function MovieDetail({ params }: { params: Promise<{ id: string }> }){
    const { id } = use(params);
    const { t } = useTranslation();
    const { getFilteredMovieById } = useDataStore();
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const movie = getFilteredMovieById(Number.parseInt(id));
    const formatDate = (date: string) => {
        const newDate = new Date(date);
        return new Intl.DateTimeFormat('vi-VN').format(newDate);
    }

    if (!movie){
        return (<div>
            Không có phim
        </div>)
    }

    return (
        <>
            <div className="flex items-center px-4 max-w-screen-xl mx-auto p-4">
                <Link href={"/home"} className="flex items-center"> <HomeIcon className="h-5 w-5 pd-1" /> <ChevronRightIcon className="h-5 w-5  text-gray-400" /></Link>
                <Link href={"/home"} className="flex items-center"> Phim chiếu <ChevronRightIcon className="h-5 w-5  text-gray-400" /></Link>
                <span className="text-gray-600">{movie.title}</span>
            </div>
            <div className="relative z-10 flex items-center justify-center bg-black py-4 text-white text-opacity-95 sm:py-6">
                <div
                    style={{
                        backgroundImage: `linear-gradient(to right, rgba(0,0,0,1), rgba(0,0,0,0.4)), url(${movie.poster_url})`,
                    }}
                    className="absolute top-0 z-0 h-full w-full overflow-hidden bg-cover bg-center bg-no-repeat"
                ></div>

                <div className="px-4 py-6 max-w-screen-xl mx-auto grid grid-cols-7 gap-8 z-10">
                    <div className="relative col-span-2">
                        <img
                            src={movie.poster_url}
                            alt={movie.title}
                            className="w-full h-112 object-cover cursor-pointer"
                        />
                        <button
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                p-3 bg-transparent border-2 border-white text-white rounded-full
                                hover:bg-white/10 transition duration-200 cursor-pointer"
                            onClick={()=>{
                                setIsOpenDialog(true);
                            }}
                        >
                            <svg className="h-6 w-6 fill-white" viewBox="0 0 20 20">
                                <path d="M6 4l10 6-10 6V4z" />
                            </svg>
                        </button>
                    </div>
                    <div className="col-span-5 space-y-4">
                        <div className="group cursor-pointer text-white">
                            <div className={`text-4xl font-semibold py-2`}>
                                {movie.title}
                            </div>
                            <div className="text-tiny leading-tight text-gray-400">
                                Thời lượng: {movie.duration} phút
                            </div>
                        </div>
                        <div className="flex text-white">
                            {
                                movie.rating &&
                                <span className="py-1 flex items-center justify-center gap-1 text-3xl font-semibold">
                                    <StarIcon className="h-10 w-10 text-yellow-500 pb-1" /> {movie.rating}
                                </span>
                            }
                        </div>
                        <div className="text-white">
                            <span className="font-semibold text-xl">Nội dung</span>
                            <p className="text-gray-300 text-sm">{movie.description}</p>
                        </div>
                        <div className="text-white flex space-x-7">
                            <div className="space-y-4">
                                <span className="text-gray-300 text-s">Ngày công chiếu</span>
                                <p className="font-semibold text-xl">{formatDate(movie.release_date)}</p>
                            </div>
                            <div className="space-y-4">
                                <span className="text-gray-300 text-sm">Thể loại</span>
                                <p className="font-semibold text-xl">{movie.genre}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="relative z-10 flex items-center justify-center py-4">
                <div className="px-4 py-6 max-w-screen-xl mx-auto grid grid-cols-12 gap-8 z-10">
                    <div className="relative col-span-9 space-y-6">
                        <AppMovieSchedule />
                        <div className="border-b border-gray-200"></div>
                        <div className="font-semibold text-xl">Bình luận từ người xem</div>
                    </div>
                    <div className="relative col-span-3">
                        <div className="pb-2 border-b border-dotted border-gray-500">{t("Now Showing")}</div>
                        <MovieShowing/>
                    </div>
                </div>
            </div>
            <MovieDialog isOpen={isOpenDialog} setIsOpen={setIsOpenDialog} movie={movie}/>
        </>
    )
}