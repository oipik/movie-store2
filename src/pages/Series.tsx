import React, { useEffect, useState } from 'react'
import { useGetSeriesQuery } from '../store/movies/movies.api'
import { useSearchParams, useNavigate } from 'react-router-dom';

import Paginate from '../components/paginate/Paginate';
import Card from '../components/card/Card';
import SwitcherTheme from '../components/switcherTheme/SwitcherTheme';

const Series: React.FC = () => {
  const [newPage, setNewPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page') || '1');
  const navigate = useNavigate();

  const { docs: data = [], pageCount = 0, isLoading, isError, isFetching, refetch } = useGetSeriesQuery(page, {
    selectFromResult: ({ data, isLoading, isError, isFetching }) => ({
      docs: data?.docs,
      limit: data?.limit,
      page: data?.page,
      pageCount: data?.pages,
      isLoading, isError, isFetching
    })
  });

  useEffect(() => {
    navigate(`?page=${newPage}`);
  }, [newPage])

  const handlePageClick = ({ selected }: { selected: number }) => {
    setNewPage(selected + 1);
  };

  const movies = data?.map((movie, i) => {
    return <Card query={`/series/${movie.id}`} key={i} movie={movie} />
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

export default Series