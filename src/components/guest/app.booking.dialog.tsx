import { getTime } from "@/utils/common";
import { MapPinIcon } from "@heroicons/react/20/solid";
import { t } from "i18next";
import { useSession } from "next-auth/react";

interface Props {
    isOpen: boolean;
    setIsOpen: (value:boolean) => void;
    movie: Movie;
    cinema: Cinema;
    totalPrice: number;
    bookingSeats: SeatsScreen[];
    setSelectShowtime: (value: Showtimes| null) => void;
    selectScreen: ScreenShowTime;
    selectShowtime: Showtimes;
}

export default function BookingDialog(props: Props) {
    const {isOpen, setIsOpen, movie, cinema, totalPrice, bookingSeats, setSelectShowtime, selectScreen, selectShowtime} = props;
    const start = new Date(selectShowtime.start_time);
    const { data: session } = useSession();
    const handleBookingSeat = async () => {
        try {
            const seats = bookingSeats.map((seat) => seat.id);
            
            const res = await fetch(process.env.NEXT_PUBLIC_HTTP_GUEST + "screen/seat/booking/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_id: session?.user.id,
                    showtime_id: selectShowtime.showtime_id,
                    total_amount: totalPrice,
                    seats_id: seats,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                console.error("Booking failed:", text);
                return;
            }

            const data = await res.json();
            if (data.message === "OK") {
                setIsOpen(false);
                setSelectShowtime(null);
            } else {
                console.warn("Unexpected response:", data);
            }
        } catch (error) {
            console.error("Error booking seat:", error);
        }
    };
    
    return (
        isOpen &&
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="relative w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="relative items-center p-2 md:p-3 border-b rounded-t dark:border-gray-600 border-gray-200">
                    <h3 className="text-xl w-full text-center font-semibold text-pink-600 dark:text-white">
                        {t("Booking Information")}
                    </h3>
                    <button onClick={()=> setIsOpen(false)} type="button" 
                        className="absolute top-1 right-1 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                    </button>
                </div>
                <div className="px-6 py-5 border-b rounded-t dark:border-gray-600 border-gray-300">
                    <h2 className="font-semibold pb-3 border-b border-dotted border-gray-300">{movie.title}</h2>
                    <ul className="grid grid-cols-1 gap-y-4 py-4">
                        <li className="flex items-center justify-between space-x-2 w-full">
                            <div className="space-y-1 w-full">
                                <p className="text-gray-400 text-sm">{t("TIME")}</p>
                                <p className="font-semibold">
                                    {getTime(selectShowtime.start_time) + " ~ " + getTime(selectShowtime.end_time)}
                                </p>
                            </div>
                            <div className="space-y-1 w-full">
                                <p className="text-gray-400 text-sm">{t("DAY")}</p>
                                <p className="font-semibold">
                                    {start.getDate()}/{start.getMonth() + 1}/{start.getFullYear()}
                                </p>
                            </div>
                        </li>
                        <li className="flex items-center justify-between space-x-2 w-full">
                            <div className="space-y-1 w-full">
                                <p className="text-gray-400 text-sm">CENIMA</p>
                                <p className="font-semibold">{cinema.name}</p>
                                <p className="flex items-center text-gray-400 text-sm">
                                    <MapPinIcon className="w-5 h-5 text-gray-400" 
                                    style={{
                                        paddingTop : "2px"
                                    }} aria-hidden="true" />{cinema.address}</p>
                            </div>
                        </li>
                        <li className="flex items-center justify-between space-x-2 w-full pb-4 border-b border-dotted border-gray-300">
                            <div className="space-y-1 w-full">
                                <p className="text-gray-400 text-sm">{t("SCREEN 1")}</p>
                                <p className="font-semibold">{selectScreen.screen_name}</p>
                            </div>
                            <div className="space-y-1 w-full">
                                <p className="text-gray-400 text-sm">{t("FORMAT")}</p>
                                <p className="font-semibold">{selectScreen.screen_type}</p>
                            </div>
                        </li>
                        <li className="flex items-center justify-between space-x-2 w-full">
                            <div className="space-y-1 w-full">
                                <p className="text-gray-400 text-sm">{t("Seat")}</p>
                                <p className="font-semibold">
                                    {
                                        bookingSeats?.map(seat => seat.seat_name + (seat.seat_name_couple ? ", " + seat.seat_name_couple : ""))
                                        .join(", ")
                                    }
                                </p>
                            </div>
                            <div className="space-y-1 w-full">
                                <p className="text-gray-400 text-sm"></p>
                                <p className="font-semibold">{new Intl.NumberFormat("vi-VN").format(totalPrice)} đ</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div className="px-6 py-2 flex items-center justify-end space-x-3 py-1.50 border-b border-gray-200">
                    <div onClick={()=>handleBookingSeat()} className="text-white text-lg hover:bg-pink-600 rounded-lg border border-pink-500 bg-pink-500 p-2 cursor-pointer">
                        {t("Payment")}
                    </div>
                </div>
            </div>
        </div>
    )
}