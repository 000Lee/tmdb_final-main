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

   /*
   최초로 메뉴 클릭 시 MovieCategory 컴포넌트 렌더링
 이후 메뉴 클릭 시 MovieCategory 컴포넌트는 재렌더링X
->같은 MovieCategory 컴포넌트를 사용하기 때문에
react-router-dom에서 경로가 바뀌어도
새로운 컴포넌트를 랜더링 하지 X
???=> 따라서 state는 메인 페이지에 있다가 최초로 메뉴중 하나를 클릭 시 
???처음에만 1로 지정되고 이후 다른 메뉴 클릭 시 1로 초기화 되지 않음
???==>따라서 반드시 useEffect를 사용해 1로 초기화

메인페이지에 있다가 최초로 메뉴를 클릭했을때는 MovieCategory 컴포넌트가 최초로 렌더링이 되면서 1번 useEffect와 2번 useEffect를 모두 실행한다
->1번 useEffect에서 page 바뀜, 2번 useEffect API calling이 모두 일어나고 page가 바뀌는 현상때문에 2번 useEffect API calling이 한번 더 발생한다
->이후 다른 메뉴 클릭시에는 category props만 바뀔 뿐 MovieCategory 컴포넌트가 재렌더링이 되지는 않으므로 API calling이 2번 되는 현상은 발생하지 X
->다만 해당 카테고리의 page state가 1로 바뀌면서 2번 useEffect가 한번 실행된다

->따라서 useRef를 사용해 최초로 메뉴 클릭시에만 1번 useEffect를 실행하지 않도록 만들어준다. (어차피 최초 메뉴 클릭시엔 page state는 모두 1)
 */

   //1번 useEffect
   //카테고리 page로 사용할 state 지정
   const [page, setPage] = useState({
      popular: 1,
      now_playing: 1,
      upcoming: 1,
   })

   const isFirstLoad = useRef(true)

   //2번 useEffect
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
