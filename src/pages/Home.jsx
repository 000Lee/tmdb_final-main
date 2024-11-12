import React, { useState, useCallback } from 'react'

import '../styles/common.css'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import { Wrap, Main } from '../styles/StyledComponent'
import PosterSlider from '../components/slider/PosterSlider'
import TvSlider from '../components/slider/TvSlider'
import Banner from '../components/Banner'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
// https://mui.com/material-ui/react-toggle-button/#color

function Home() {
   const [alignment, setAlignment] = useState('movie')

   const handleChange = useCallback((event, newAlignment) => {
      if (newAlignment !== null) {
         setAlignment(newAlignment) // 선택된 버튼에 맞게 상태 업데이트
      }
   }, [])

   return (
      <Wrap>
         <Menu />
         <Main>
            <Banner />
            <div className="common_margin_tb">
               <div style={{ display: 'flex' }}>
                  <h3 style={{ height: '50px', lineHeight: '50px' }}>현재 상영중</h3>&nbsp;&nbsp;
                  <ToggleButtonGroup color="primary" value={alignment} exclusive onChange={handleChange} aria-label="Platform">
                     <ToggleButton value="movie">영화</ToggleButton>
                     <ToggleButton value="tv">TV</ToggleButton>
                  </ToggleButtonGroup>
               </div>
               {/* 선택된 값에 따라 컴포넌트 조건부 렌더링 */}
               {alignment === 'movie' ? <PosterSlider /> : <TvSlider />}
            </div>
         </Main>
         <Footer />
      </Wrap>
   )
}

export default Home
