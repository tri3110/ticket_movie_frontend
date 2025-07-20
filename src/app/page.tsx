'use client'

import AppSlider from '@/components/app.movie.slider';
import { useTranslation } from 'react-i18next';
import AppMovieSchedule from '@/components/app.movie.schedule';
import { useDataStore } from '@/utils/store';

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

  const data = useDataStore((state) => state.data?.movies);
  if (data == null){
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
      <div className='bg-pink-50'>
        <h2 className="px-4 py-3 max-w-screen-xl mx-auto text-3xl font-bold text-center text-red-600 pt-6">{ t("Coming Soon") }</h2>
        <div className="px-4 max-w-screen-xl mx-auto bg-white">
          <AppSlider movies={data} themeStyle={themeStyle.Light}/>
        </div>
      </div>
      <div className='bg-pink-50 pb-6'>
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-3xl font-bold text-center pt-12 mb-5 text-red-600">{t("Movie schedule")}</h2>
          <AppMovieSchedule />
        </div>
      </div>

    </>
  );
}