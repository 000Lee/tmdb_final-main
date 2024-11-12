import axios from 'axios'

// TMDB API 기본 URL과 API 키 설정
const BASE_URL = 'https://api.themoviedb.org/3'
const AUTH_KEY = process.env.REACT_APP_TMDB_API_KEY

// axios 인스턴스 생성
const tmdbApi = axios.create({
   baseURL: BASE_URL,
   headers: {
      accept: 'application/json',
      Authorization: `Bearer ${AUTH_KEY}`,
   },
})

// 공통 API 호출 함수
const fetchFromApi = async (url, params = {}) => {
   /* ? */
   // 하나가 아니라 여러개 받을거니까 params에 빈객체로 설정?????????
   try {
      const response = await tmdbApi.get(url, { params })
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}

// 인기, 상영중, 개봉 예정 영화 가져오기
export const getMovies = (category = 'popular', page = 1) => {
   // category 따라 엔드포인트 동적으로 설정
   //App.js에서 category props 줬었음. 그거랑 연관 있음
   const endpoint = {
      popular: '/movie/popular',
      now_playing: '/movie/now_playing',
      upcoming: '/movie/upcoming',
   }[category]
   // 기본값을 'popular'로 설정 (그냥 카테고리 버튼 누르면 들어가는 창인듯?)
   //[category]=['popular']=json객체 읽는법중 하나에 있었음

   return fetchFromApi(endpoint, {
      language: 'ko-KR',
      page,
      region: 'KR',
   })
}

// 영화 상세 정보 가져오기
export const getMovieDetails = (movieId) => {
   return fetchFromApi(`/movie/${movieId}`, {
      language: 'ko-KR',
   })
}

// 출연 배우 정보 가져오기
export const getMovieCredits = (movieId) => {
   return fetchFromApi(`/movie/${movieId}/credits`, {
      language: 'ko-KR',
   })
}

// 인기, 방송 중인 tv 목록 가져오기
export const getTVs = (type, page = 1) => {
   // type에 따라 엔드포인트 동적으로 설정
   const endpoint = {
      popular: '/tv/popular',
      nowPlaying: '/tv/on_the_air',
   }[type]
   /* ? */
   //여기 type은 뭐지???  어디서 온거지??
   //변수명 디폴트가 타입인건가? 무비에서는 따로 설정한거고?
   //아닌데 어디서 온건지 모르겠는데 tmdb 설정인가?
   //쨋든 타입으로 popular,nowPlaying 둘중 하나 고르는듯 (?)
   return fetchFromApi(endpoint, {
      language: 'ko-KR',
      page,
      region: 'KR',
   })
}

// 검색 API 호출 함수
export const searchMovie = (query, page = 1) => {
   return fetchFromApi('/search/movie', {
      query, // 검색어
      page, // 페이지 번호 (기본값 1)
      language: 'ko-KR', // 언어 설정
      include_adult: false, // 성인 콘텐츠 제외
      region: 'KR',
   })
}

export default tmdbApi
