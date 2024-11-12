import { configureStore } from '@reduxjs/toolkit'
import moviesReducer from '../features/movies/moviesSlice'
import tvsReducer from '../features/tvs/tvsSlice'

const store = configureStore({
   reducer: {
      movies: moviesReducer,
      tvs: tvsReducer,
   },
})

export default store
