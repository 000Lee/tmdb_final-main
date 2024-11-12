import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getMovies, getMovieDetails, getMovieCredits, searchMovie } from '../../api/tmdbApi'

/*
createAsyncThunk의 async 함수에서 매개변수로 여러 값을 받으려면, 객체 혹은 배열로 받아야함
-객체로 전달: category와 page를 객체로 묶어서 전달하는 방법.
-배열로 전달: category와 page를 배열로 전달하는 방법.
현재 코드에서는 async (category, page)로 두 개의 매개변수를 전달하고 있는데, createAsyncThunk에서 함수는 기본적으로 하나의 매개변수 값만 받을 수 있기 때문에 문제가 발생할 수 있음-> 객체로 전달하는 것이 일반적=>여기서는 객체로 전달함
*/

// 비동기 Thunk 액션: 영화 목록들(인기,현재상영중, 개봉예정)을 API로부터 가져옴
export const fetchMovies = createAsyncThunk('movies/fetchMovies', async ({ category, page }) => {
   const response = await getMovies(category, page)

   // API 응답에서 필요한 데이터만 반환 (예: response.data.results)
   return response.data.results // 또는 필요한 데이터 구조에 맞게 수정
})

// 영화 상세 정보 가져오기
export const fetchMovieDetails = createAsyncThunk('movies/fetchMovieDetails', async (movieId) => {
   const response = await getMovieDetails(movieId)

   return response.data
})

// 출연 배우 정보 가져오기
export const fetchMovieCredits = createAsyncThunk('movies/fetchMovieCredits', async (movieId) => {
   const response = await getMovieCredits(movieId)

   console.log(response.data)
   return response.data
})

// 검색어로 영화, TV 프로그램 검색
export const fetchSearchResults = createAsyncThunk('movies/fetchSearchResults', async ({ query, page }) => {
   const response = await searchMovie(query, page)
   return response.data.results
})

// Slice 생성
const moviesSlice = createSlice({
   name: 'movies',
   initialState: {
      loading: false, // 로딩여부 state
      movies: [], // 영화 정보 state
      movieDetails: null, // 영화 상세 정보 state
      movieCredits: null, // 출연 배우 정보 state
      error: null, // 에러 메세지 state
   },
   reducers: {
      resetMovies(state) {
         state.movies = [] // movies state 초기화
      },
   },
   extraReducers: (builder) => {
      /*
         promise 결과 반환
         pending: 대기상태, fulfilled: 성공상태, rejected: 실패상태
      */
      builder
         .addCase(fetchMovies.pending, (state) => {
            state.loading = true //로딩 중
            state.error = null
         })
         .addCase(fetchMovies.fulfilled, (state, action) => {
            state.loading = false //로딩 완료
            if (action.meta.arg.page === 1) {
               // 페이지가 1일때는 그냥 새로운 데이터로 state 업데이트
               state.movies = action.payload
            } else {
               //페이지가 2 이상일때는 기존 데이터 + 새로운 데이터로 state 업데이트

               /*
               state.movies = [...state.movies, ...action.payload]와 같은 방식으로 새로운 배열을 할당하는 것은 허용되지만, state = [...state, ...]처럼 최상위 상태를 재할당하는 것은 불가능.
               */
               state.movies = [...state.movies, ...action.payload]

               /*
               툴킷은 불변성이 유지 되므로 아래와 같이 작성해도 된다. 
               action.payload.forEach((movie) => state.movies.push(movie))
               
               다만 fulfilled가 여러번 실행되면서 데이터가 중복해서 들어가므로 아래와 같이 걸러준다. -> fulfilled가 여러번 실행 방지 해결필요(첫페이지 들어올때만 그렇긴함) -> useEffect 조정

               useEffect조정 이후에도 종종 중복되서 들어가는 이유는 인기영화, 현재 상영 중, 개봉예정 영화 중 겹치는 영화들이 존재한다. 따라서 아래와 같이 id가 같은 영화는 필터링을 진행을 해줘야 한다
               
               action.payload.forEach((movie) => {
                  if (!state.movies.some((existingMovie) => existingMovie.id === movie.id)) {
                     state.movies.push(movie)
                  }
               })
               */
            }
         })
         .addCase(fetchMovies.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message // 에러발생시 에러메세지 전달
         })

         .addCase(fetchMovieDetails.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMovieDetails.fulfilled, (state, action) => {
            state.loading = false
            state.movieDetails = action.payload
         })
         .addCase(fetchMovieDetails.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         .addCase(fetchMovieCredits.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchMovieCredits.fulfilled, (state, action) => {
            state.loading = false
            state.movieCredits = action.payload
         })
         .addCase(fetchMovieCredits.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })

         .addCase(fetchSearchResults.pending, (state) => {
            state.loading = true
            state.error = null
         })
         .addCase(fetchSearchResults.fulfilled, (state, action) => {
            state.loading = false
            // state.searchResults = action.payload // 검색 결과 상태에 저장

            if (action.meta.arg.page === 1) {
               state.searchResults = action.payload
            } else {
               state.searchResults = [...state.searchResults, ...action.payload]
               // action.payload.forEach((movie) => state.searchResults.push(movie))
            }
         })
         .addCase(fetchSearchResults.rejected, (state, action) => {
            state.loading = false
            state.error = action.error.message
         })
   },
})

export default moviesSlice.reducer
