'use client'

import AppSlider from '@/components/guest/app.movie.slider';
import { useTranslation } from 'react-i18next';
import AppMovieSchedule from '@/components/guest/app.movie.schedule';
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
  const {getFilteredMovieByStatus} = useDataStore();
  const moviesShowing = getFilteredMovieByStatus("showing");
  const moviesComing = getFilteredMovieByStatus("coming");

  if (data == null){
    return (
      <div>
        Loading....
      </div>
    );
  }
  
  return (
    <>
    </>
  );
}