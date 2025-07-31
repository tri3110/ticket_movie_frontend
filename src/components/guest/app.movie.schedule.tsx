import { useEffect, useMemo, useState } from "react"
import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { ChevronDownIcon, MagnifyingGlassIcon, MapPinIcon } from "@heroicons/react/20/solid"
import { useTranslation } from "react-i18next";
import { useDataStore } from "@/utils/store";
import dayjs from 'dayjs';
import SeatDialog from "./app.seat.dialog";
import { getTime } from "@/utils/common";

type City = {
    id: number; 
    name: string;
    country: string;
}

export default function AppMovieSchedule () {
    const cities = useDataStore((state) => state.data?.cities ?? []);
    const [selectedCity, setSelectedCity] = useState<City | null>(cities[0]);
    const [valueSearch, setValueSearch] = useState("");
    const [limit, setLimit] = useState(5);
    const [query, setQuery] = useState('');
    const {t} = useTranslation();
    const { getFilteredCinemasById } = useDataStore();

    const cinemas = useMemo(() => {
        return selectedCity
            ? getFilteredCinemasById(selectedCity.id, valueSearch, limit)
            : [];
        }, [selectedCity, valueSearch, limit, getFilteredCinemasById]);

    const [selectedCinema, setSelectedCinema] = useState<Cinema | null>(cinemas[0]);

    const filteredCity = useMemo(() => {
        return query === ''
            ? cities
            : cities.filter((city) =>
                city.name.toLowerCase().includes(query.toLowerCase())
            );
        }, [cities, query]);
    
    useEffect(() => {
        setLimit(5);
        setValueSearch("");
        setSelectedCinema(cinemas.length > 0 ? cinemas[0] : null);
    }, [selectedCity]);

    const days = useMemo(() => {
        const result = [];
        const today = dayjs();

        for (let i = 0; i < 7; i++) {
            const date = today.add(i, 'day');
            result.push({
                day: date.date(),
                weekday: i == 0 ? "Today" : date.format('dddd'),
                fullDate: date.format('YYYY-MM-DD'), 
            });
        }

        return result;
    }, []);

    const [selectedDay, setSelectedDay] = useState(days[0].fullDate);

    const [moviesSchedule, setMoviesSchedule] = useState<MovieSchedule[]>([]);
    useEffect(() => {
        const fetchSchedule = async () => {
            if (!selectedCinema || !selectedDay) return;

            try {
                const response = await fetch("http://127.0.0.1:8000/app/api/main/movies/schedule/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        cinema_id: selectedCinema.id,
                        day: selectedDay,
                    }),
                });

                const data = await response.json();
                setMoviesSchedule(data);
            } catch (error) {
                console.error("Failed to fetch schedule:", error);
            }
        };

        fetchSchedule();
    }, [selectedCinema, selectedDay]);

    const [selectScreen, setSelectScreen] = useState<Screens | null>();
    const [selectShowtime, setSelectShowtime] = useState<Showtimes | null>();
    const [selectMovie, setSelectMovie] = useState<Movie | null>();
    const [dataSeatsScreen, setdataSeatsScreen] = useState<DataSeatsScreen | null>();

    useEffect(()=>{
        if (selectShowtime){
            const fetchScreenSeat = async () => {
                const response = await fetch("http://127.0.0.1:8000/app/api/main/screen/seat/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        screen_id: selectScreen?.screen_id,
                        showtime_id: selectShowtime.showtime_id
                    }),
                })

                const data = await response.json();
                setdataSeatsScreen(data);
            }

            fetchScreenSeat();
        }
        
    }, [selectShowtime])

    const [showSeatDialog, setShowSeatDialog] = useState(false);
    const [showLoading, setShowLoading] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (selectShowtime && dataSeatsScreen) {
            setShowLoading(true); 
            setShowSeatDialog(false);

            timer = setTimeout(() => {
                setShowSeatDialog(true);
                setShowLoading(false);
            }, 200);
        } else {
            setShowSeatDialog(false);
            setShowLoading(false);
        }

        return () => clearTimeout(timer);
    }, [selectShowtime, dataSeatsScreen]);

    return (
        <div className="h-[700px] flex flex-col md:shadow-soju1 rounded-lg border-gray-200 bg-white md:overflow-hidden md:border">
            <div className="flex items-center py-3 md:px-4 gap-4 border-b border-gray-200">
                <label className="text-sm">{t("Location")}</label>
                <Combobox value={selectedCity} onChange={setSelectedCity}>
                    <div className="relative w-60">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-1 flex items-center pr-2">
                                <MapPinIcon className="w-5 h-5 text-red-400" 
                                style={{
                                    paddingBottom : "2px"
                                }} aria-hidden="true" />
                            </div>
                            <ComboboxInput
                                displayValue={(city: City | null) => city?.name ?? ''}
                                onChange={(event) => setQuery(event.target.value)}
                                className="w-full pl-8 pr-3 py-2 pr-10 border border-red-500 rounded-md focus:outline-none "
                            />
                            <ComboboxButton className="absolute inset-y-0 right-0 flex items-center pr-2">
                                <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                            </ComboboxButton>
                        </div>

                        <ComboboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5">
                        {
                            filteredCity.length === 0 ? (
                                <div className="px-3 py-2 text-gray-500">Không có kết quả</div>
                            ) : (
                                filteredCity.map((city) => (
                                <ComboboxOption
                                    key={city.id}
                                    value={city}
                                    className={({ active }) =>
                                    `cursor-pointer px-4 py-2 ${
                                        active ? 'bg-blue-500 text-white' : ''
                                    }`
                                    }
                                >
                                    {city.name}
                                </ComboboxOption>
                                ))
                            )
                        }
                        </ComboboxOptions>
                    </div>
                </Combobox>
            </div>

            <div className="grid grid-cols-6 flex-1 overflow-hidden min-h-0">
                <div className="col-span-2 border-r border-gray-200 flex flex-col overflow-hidden">
                    <div className="p-2 border-b border-gray-200">
                        <div className="relative flex items-center border border-gray-200 rounded-lg">
                            <input
                                type="text"
                                value={valueSearch}
                                placeholder={t("Enter cinema name")}
                                className="w-full pr-10 px-3 py-2 text-sm text-gray-800 dark:text-white bg-transparent outline-none"
                                onChange={(e)=>{
                                    setValueSearch(e.target.value);
                                }}
                            />
                            <MagnifyingGlassIcon className="absolute right-3 h-6 w-6 text-gray-600 hover:text-gray-800" />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {
                            cinemas.length === 0 ? (
                                <p className="text-gray-400 px-4 py-2">Không có rạp nào ở thành phố này</p>
                            ) : (
                                    cinemas.map((cinema) => (
                                        <div 
                                        key={cinema.id}
                                        onClick={() => setSelectedCinema(cinema)}
                                        className={`
                                            ${selectedCinema?.id == cinema.id ? "bg-blue-100 opacity-100" : ""} 
                                            border-b border-gray-200 px-4 py-3 cursor-pointer`
                                        }>
                                            <h3 className="text-md">{cinema.name}</h3>
                                            <p className="text-xs text-gray-400">☎ {cinema.phone}</p>
                                        </div>
                                    )
                                )
                            )
                        }
                        {
                            cinemas.length > 0 && cinemas.length === limit &&
                            <div className="text-center p-5">
                                <button 
                                    className="p-1 border border-red-600 rounded-xl text-red-600 hover:bg-red-200 cursor-pointer"
                                    onClick={()=>setLimit(limit + 5)}
                                    > {t("View more")}
                                </button>
                            </div>
                        }
                    </div>
                </div>

                <div className="col-span-4 flex flex-col overflow-hidden">
                    {
                        cinemas.length != 0 && selectedCinema && 
                        <div className="flex flex-col flex-1 min-h-0">
                            <div className="border-b border-gray-200">
                                <div className="relative flex items-center">
                                    <div className="px-4 py-3">
                                        <h3 className="text-xl text-red-400">{t("Movie schedule") + selectedCinema.name}</h3>
                                        <p className="flex text-ms text-gray-400">
                                            <MapPinIcon className="w-5 h-5 text-gray-400" 
                                            style={{
                                                paddingTop : "2px"
                                            }} aria-hidden="true" />
                                            {selectedCinema.address}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-1 border-b border-gray-200">
                                <div className="grid grid-cols-7 flex-1 overflow-hidden gap-4">
                                    {
                                        days.map((day)=>(
                                            <div onClick={() => setSelectedDay(day.fullDate)} key={day.day} className={`${selectedDay == day.fullDate ? "border border-pink-600" : "border border-gray-200"} m-1 rounded-lg cursor-pointer`}>
                                                <div className={`${selectedDay == day.fullDate ? "bg-pink-600 text-white" : "bg-gray-100"} rounded-t-[5px] mx-auto py-1 text-center text-lg font-semibold`}>
                                                    {day.day}
                                                </div>
                                                <div className="mx-auto py-1 text-center truncate text-sm">{t(day.weekday)}</div>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                {
                                    moviesSchedule.map((movieSchedule)=> (
                                        <div key={movieSchedule.movie.id} className="grid grid-cols-1 md:grid-cols-5 gap-2 p-2 cursor-pointer border-b border-gray-200">
                                            <div className="flex items-center">
                                                <img
                                                src={movieSchedule.movie.poster_url}
                                                alt={movieSchedule.movie.title}
                                                className="h-42 w-full object-cover rounded-md shadow-md"
                                                />
                                            </div>

                                            <div className="md:col-span-4 space-y-2 ml-3">
                                                <h2 className="font-semibold leading-tight text-pink-500">{movieSchedule.movie.title}</h2>
                                                <p className="text-sm text-gray-400">{movieSchedule.movie.genre}</p>

                                                {
                                                    movieSchedule.screens.map((screen)=>(
                                                        <div key={screen.screen_id} className="pt-2 ">
                                                            <h2 className="font-semibold leading-tight">{screen.screen_type}</h2>
                                                            <div className="pt-2 space-x-3">
                                                            {
                                                                screen.showtimes.map((showtimes)=>(
                                                                    <button key={showtimes.showtime_id} onClick={() => {
                                                                            setSelectShowtime(showtimes);
                                                                            setSelectScreen(screen);
                                                                            setSelectMovie(movieSchedule.movie);
                                                                        }} 
                                                                        className="text-blue-600 hover:bg-blue-200 border border-blue-600 rounded-lg p-1 cursor-pointer">
                                                                        {
                                                                            getTime(showtimes.start_time) + " ~ " + getTime(showtimes.end_time)
                                                                        }
                                                                    </button>
                                                                ))
                                                            }
                                                            </div> 
                                                        </div>
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
            {showLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="flex flex-col items-center space-y-2">
                        <svg className="animate-spin h-8 w-8 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                        </svg>
                    </div>
                </div>
            )}
            {
                showSeatDialog && selectMovie && dataSeatsScreen && selectedCinema && selectScreen && selectShowtime &&(
                <SeatDialog
                    movie={selectMovie}
                    setSelectShowtime={setSelectShowtime}
                    dataSeatsScreen={dataSeatsScreen}
                    cinema={selectedCinema}
                    selectScreen={selectScreen}
                    selectShowtime={selectShowtime}
                />
            )}
        </div>
    )
}