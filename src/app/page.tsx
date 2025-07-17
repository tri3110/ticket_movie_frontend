'use client'

import useSWR from 'swr'
import AppSlider from '@/components/app.movie.slider';
import { useTranslation } from 'react-i18next';
import AppMovieSchedule from '@/components/app.movie.schedule';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const themeStyle = {
    Dark : {
        text: "text-white"
    },
    Light: {
        text: "text-gray-800"
    }
}

export default function Home() {
  const { t } = useTranslation();
  const { data, error, isLoading } = useSWR(
    "http://127.0.0.1:8000/app/api/main/data/", 
    fetcher,
    {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
  )
  if (data == undefined){
    return (
      <div>
        Loading....
      </div>
    );
  }
  
  return (
    <>
      <div className="bg-black bg-center bg-cover bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-rap.jpg')",
            backgroundSize: "contain",
          }}
        >
        <div className="px-4 max-w-screen-xl mx-auto text-white">
          <h2 className="text-3xl font-bold text-center pt-6">{ t("Now Showing") }</h2>
          <AppSlider movies={data} themeStyle={themeStyle.Dark}/>
        </div>
      </div>
      <div className='bg-white'>
        <div className="px-4 max-w-screen-xl mx-auto text-red-600">
          <h2 className="text-3xl font-bold text-center pt-6">{ t("Coming Soon") }</h2>
          <AppSlider movies={data} themeStyle={themeStyle.Light}/>
        </div>
      </div>
      <div className='bg-white'>
        <div className="px-4 max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold text-center pt-12 mb-5 text-red-600">Lịch chiếu phim</h2>
          <AppMovieSchedule />
        </div>
      </div>

    </>
  );
}