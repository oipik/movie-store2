import React, { useEffect } from 'react'

import { useGetMoviesQuery } from '../store/movies/movies.api'
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { changeCurrentPageMovie } from '../store/movies/movies.slice';

import Paginate from '../components/paginate/Paginate';
import Card from '../components/card/Card';
import SwitcherTheme from '../components/switcherTheme/SwitcherTheme';

const Movies: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { currentPageMovie: currentPage } = useAppSelector(state => state.movies);
  const dispatch = useAppDispatch();

  const { docs: data = [], page = 0, pageCount = 0, isLoading, isError, isFetching } = useGetMoviesQuery(currentPage, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      docs: data?.docs,
      limit: data?.limit,
      page: data?.page,
      pageCount: data?.pages,
      isLoading, isError, isFetching
    })
  });

  useEffect(() => {
    setSearchParams(`page=${currentPage}`);
  }, [currentPage])

  const handlePageClick = ({ selected }: { selected: number }) => {
    dispatch(changeCurrentPageMovie(selected + 1));
  };

  const movies = data?.map((movie, i) => {
    return <Card query={`/movies/${movie.id}`} key={i} movie={movie} />
  })

  return (
    <>
      <div className='flex flex-wrap justify-center gap-[40px]'>
        {isError && <p className='text-4xl dark:text-white'>Ошибка доступа...</p>}
        {isLoading || isFetching ? <p className='text-4xl dark:text-white'>Loading...</p> : movies}
      </div>
      <div className='relative'>
        {!(isLoading || isFetching) && <SwitcherTheme />}
        {(movies?.length !== 0 && !isFetching) ? <Paginate initialPage={page - 1} pageCount={pageCount} handlePageClick={handlePageClick} /> : null}
      </div>
    </>
  )
}

export default Movies;