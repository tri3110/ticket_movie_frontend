"use client";

import { useState } from "react";
import BookingDialog from "./app.booking.dialog";

interface Props {
  setSelectMoviesSchedule: (value: MovieSchedule| null) => void;
  movieSchedule: MovieSchedule;
  dataSeatsScreen: DataSeatsScreen;
  cinema: Cinema;
}


export default function SeatDialog({movieSchedule, setSelectMoviesSchedule, dataSeatsScreen, cinema}: Props) {
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setSelectMoviesSchedule(null);
        }
    };

    const getTime = (dateStr:string) => {
        const date = new Date(dateStr);
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return hours + ":" + minutes;
    }
    
    const start = new Date(movieSchedule.start_time);

    const [bookingSeats, setBookingSeats] = useState<SeatsScreen[]>([]);
    const handleBookingSeat = (seat: SeatsScreen) => {
        setBookingSeats((array) => {
            if (!array) return [seat];

            if (array.some(s => s.id === seat.id)){
                return array.filter(s => s.id !== seat.id);
            }
            return [...array, seat]; 
        });
    };

    const totalPrice = bookingSeats.reduce((sum, seat) => {
        const seatPrice = seat.type === "couple" ? movieSchedule.base_price * 2 : movieSchedule.base_price;
        return sum + seatPrice;
    }, 0);

    const [isOpenBookingDialog, setIsOpenBookingDialog] = useState(false);

    return (
        <div onClick={handleBackdropClick} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        Mua Vé Xem Phim
                    </h3>
                    <button onClick={() => setSelectMoviesSchedule(null)} type="button" 
                        className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
                <div className="bg-gray-800 text-white">
                    <div className="mb-3 w-full basis-full px-20 pt-3 text-center lg:mb-6 lg:px-40">
                        <div className="mx-auto mb-1 h-1 w-64 rounded-lg bg-white"></div>
                        <div className="aspect-w-16 aspect-h-9">
                            MÀN HÌNH
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="space-y-2">
                            {
                                dataSeatsScreen.data.map((row, rowIndex) => (
                                    <div key={rowIndex} className="flex space-x-2 justify-center">
                                    {row.map((seat, colIndex) =>
                                        seat ? (
                                            <button
                                                key={seat.id}
                                                className={`
                                                    group border-none rounded-lg text-sm 
                                                    flex items-center justify-center space-x-2
                                                    ${
                                                        !seat.is_active ? "bg-gray-500 text-black" 
                                                        : (
                                                            bookingSeats.some(s => s.id == seat.id) ? "cursor-pointer bg-blue-600 text-white" 
                                                            : (seat.is_active && seat.type === "standard" 
                                                            ? "cursor-pointer bg-purple-700 hover:bg-purple-800 text-white " 
                                                            : "cursor-pointer bg-red-600 hover:bg-red-700 text-white ")
                                                        )
                                                    }
                                                    `
                                                }
                                                onClick={()=> handleBookingSeat(seat)}
                                            >
                                                <span className="w-8 h-8 flex items-center justify-center">{seat.seat_name}</span>
                                                {
                                                    seat.type == "couple" && 
                                                    <span className="w-8 h-8 flex items-center justify-center">{seat.seat_name_couple}</span>
                                                }
                                            </button>
                                        ) : (
                                        <div
                                            key={`empty-${rowIndex}-${colIndex}`}
                                            className="w-8 h-8"
                                        >
                                            <span className=""></span>
                                            <span className=""></span>
                                        </div>
                                        )
                                    )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
                <div className="items-center gap-3 px-6 py-4 border-b border-gray-200">
                    <div className="text-lg font-semibold">
                        {movieSchedule.movie_title}
                    </div>
                    <div className="text-sm text-pink-400">
                        {getTime(movieSchedule.start_time) + " ~ " + getTime(movieSchedule.end_time) + ", " 
                            + `Ngày ${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()} - ${movieSchedule.screen_type}`}
                    </div>
                </div>
                <div className="px-6 py-2 flex items-center justify-between space-x-3 py-1.50 border-b border-gray-200">
                    <div className="shrink-0 text-gray-500">
                        Chỗ ngồi
                    </div>
                    <div className="flex items-center space-x-2 rounded-lg px-3 py-1 h-[50px]">
                        {
                            bookingSeats?.map((seat) => (
                                <div className={`text-white p-2 rounded-lg space-x-3 text-sm 
                                            ${seat.type === "standard" ? "bg-purple-700" : "bg-red-600"}`} key={seat.id} >
                                    <span>
                                        {seat.seat_name}
                                    </span>
                                    {
                                        seat.type == "couple" && 
                                        <span>{seat.seat_name_couple}</span>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="px-6 py-2 flex items-center justify-between space-x-3 py-1.50 border-b border-gray-200">
                    <div className="shrink-0 text-gray-500">
                        Thành tiền: {new Intl.NumberFormat("vi-VN").format(totalPrice)} đ
                    </div>
                    <div onClick={()=>setIsOpenBookingDialog(true)} className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-2 cursor-pointer">
                        Đặt vé
                    </div>
                </div>
            </div>

            <BookingDialog 
                isOpen={isOpenBookingDialog} 
                setIsOpen={setIsOpenBookingDialog}
                movieSchedule={movieSchedule}
                cinema={cinema}
                totalPrice={totalPrice}
                bookingSeats={bookingSeats}
                setSelectMoviesSchedule={setSelectMoviesSchedule}
            />
        </div>
    );
}