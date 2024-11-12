import { Link } from 'react-router-dom'

// https://mui.com/material-ui/react-grid2/#basic-grid
// https://mui.com/material-ui/react-card/#media

import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'

function MovieCard({ movies }) {
   return (
      <Grid container spacing={2.5}>
         {movies.map((movie) => (
            <Grid size={2.4} key={movie.id}>
               <Link to={`/detail/${movie.id}`} style={{ textDecoration: 'none' }}>
                  <Card sx={{ maxWidth: 345 }}>
                     <CardMedia
                        sx={{ height: 400 }}
                        image={movie.poster_path ? `https://image.tmdb.org/t/p/w400${movie.poster_path}` : '/images/poster.png'}
                        title={movie.title || '영화이미지'}
                     />
                     <CardContent>
                        <Typography
                           gutterBottom
                           variant="h5"
                           component="div"
                           sx={{
                              fontSize: 17,
                              whiteSpace: 'nowrap', // 한 줄로 설정
                              overflow: 'hidden', // 넘치는 텍스트 숨김
                              textOverflow: 'ellipsis', // 말줄임표 적용
                              width: '200px', // 최대 너비 설정
                           }}
                        >
                           {movie.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                           {movie.release_date}
                        </Typography>
                     </CardContent>
                  </Card>
               </Link>
            </Grid>
         ))}
      </Grid>
   )
}

export default MovieCard
