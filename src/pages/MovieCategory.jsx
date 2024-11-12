import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMovies } from '../features/movies/moviesSlice'

import '../styles/common.css'
import MovieCard from '../components/MovieCard'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import { Wrap, Main } from '../styles/StyledComponent'
import Button from '@mui/material/Button'

function MovieCategory({ category }) {
   const dispatch = useDispatch()
   const { movies, loading, error } = useSelector((state) => state.movies)

   //카테고리 page로 사용할 state 지정
   const [page, setPage] = useState({
      popular: 1,
      now_playing: 1,
      upcoming: 1,
   })

   const isFirstLoad = useRef(true)

   // 카테고리가 변경될 때 페이지를 1로 초기화
   useEffect(() => {
      if (isFirstLoad.current) {
         isFirstLoad.current = false
         return
      }

      setPage((prevPage) => ({
         ...prevPage,
         [category]: 1, // 페이지를 1로 초기화
      }))
   }, [category])

   // page가 변할때 마다 영화 데이터 로딩
   useEffect(() => {
      console.log({ category, page: page[category] })
      // {category: 'popular', page: 1}
      dispatch(fetchMovies({ category, page: page[category] }))
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [dispatch, page])

   /*
   useEffect의 의존성 배열에 dispatch를 넣는 이유는 안전성을 보장하기 위해서

   useEffect에서 사용하는 모든 값(예: dispatch, category, page)을 의존성 배열에 포함할 것을 권장. dispatch는 Redux에서 제공하는 함수이지만, 이를 의존성 배열에 추가하지 않으면 경고를 표시.

   dispatch 함수는 대부분의 경우 변하지 않지만, 만약 컴포넌트가 리렌더링되면서 새로운 dispatch 함수로 재정의되거나 변경될 경우(이런 상황은 드물지만) useEffect가 최신 상태의 dispatch를 사용하지 않을 수 있다.
   */

   // 더보기를 누르면 해당 카테고리의 page state변경 -> useEffect 실행
   const loadMore = useCallback(() => {
      setPage((prevPage) => ({
         ...prevPage,
         [category]: prevPage[category] + 1,
      }))
   }, [category])

   if (loading && page === 1)
      return (
         <Wrap>
            <Menu />
            <Main>
               <h2>Loading...</h2>
            </Main>
            <Footer />
         </Wrap>
      )

   if (error)
      return (
         <Wrap>
            <Menu />
            <Main>
               <h2>Error: {error}</h2>
            </Main>
            <Footer />
         </Wrap>
      )

   return (
      <Wrap>
         <Menu />
         <Main $padding="30px 0">
            <MovieCard movies={movies} />

            <Button variant="outlined" onClick={loadMore} sx={{ margin: '20px auto', display: 'block', width: '500px' }}>
               더보기
            </Button>
         </Main>
         <Footer />
      </Wrap>
   )
}

export default MovieCategory
