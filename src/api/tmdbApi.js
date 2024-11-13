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
   try {
      const response = await tmdbApi.get(url, { params })
      return response
   } catch (error) {
      console.error(`API 요청 오류: ${error.message}`)
      throw error
   }
}
//함수 호출 시 인자의 위치를 통해 첫 번째 매개변수가 url (또는 엔드포인트)이고, 두 번째 매개변수가 params (또는 쿼리 파라미터 객체)라는 점을 JavaScript가 인식합니다.

//params 빈객체 이유
//기본값 설정: fetchFromApi 함수를 호출할 때 params를 명시하지 않아도 오류 없이 함수가 작동함.
//다중 쿼리 파라미터 지원: params는 여러 개의 쿼리 파라미터를 받아 TMDB API에 전달할 수 있는 구조
//재사용성: params를 통해 필터, 정렬, 페이지 번호 등의 여러 요청 매개변수를 한꺼번에 담아 API 요청을 유연하게 보낼 수 있어 재사용성에 좋습니다.

/* ? */
//catch에서 throw(예외를 명시적으로 발생) 설정 이유
//오류 처리를 함수 밖에서 할 수 있도록 하기 위해서

// 인기, 상영중, 개봉 예정 영화 가져오기
export const getMovies = (category = 'popular', page = 1) => {
   // category 따라 엔드포인트 동적으로 설정
   //App.js에서 category props 줬었음. 그거랑 이 함수랑 연관있음
   //매개변수명으로 연결 X  endpoint로 연결
   const endpoint = {
      popular: '/movie/popular',
      now_playing: '/movie/now_playing',
      upcoming: '/movie/upcoming',
   }[category]
   // 기본값을 'popular'로 설정 (그냥 카테고리 버튼 누르면 popular로 들어간다는 뜻인듯?)
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
   // [type]이 포인트. popular이 type 매개변수에 들어갈 시 , 결과 popular: '/tv/popular'. popular번째 객체니까.

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
