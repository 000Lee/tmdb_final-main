import Home from './pages/Home'
import { Route, Routes } from 'react-router-dom'
import NotFound from './pages/NotFound'
import Detail from './pages/Detail'
import MovieCategory from './pages/MovieCategory'
import SearchResults from './pages/SearchResults'

function App() {
   return (
      <Routes>
         <Route path="/" element={<Home />} />
         <Route path="/popular" element={<MovieCategory category="popular" />} />

         <Route path="/now_playing" element={<MovieCategory category="now_playing" />} />
         <Route path="/upcoming" element={<MovieCategory category="upcoming" />} />
         <Route path="/detail/:movieId" element={<Detail />} />
         <Route path="/search" element={<SearchResults />} />
         <Route path="/*" element={<NotFound />} />
      </Routes>
   )
}

export default App

// MovieCategory에서 각각 props 줌
//각각의 컴포넌트에서 props 받아와서 연결(?)
//ex) function MovieCategory({ category }) {

//잘 뜨는지 확인할때 메뉴바에 없는것은 수동으로 쳐서 확인 가능
// ex) http://localhost:3001/search

// 다른방법)) * , <Outlet />,해당 path 바로 아래 이름만 딸랑 적으면 하위경로

/* ? */
/* Route에도 props를 줄 수 있었나??? props????? */
