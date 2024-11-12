import styled from 'styled-components'

/*
falsy 연산

[falsy 값 종류]
false (Boolean false)
0 (숫자 0)
"" 또는 '' (빈 문자열)
null
undefined
NaN (Not-a-Number)

*/
export const Wrap = styled.div`
   overflow: hidden;
   min-width: ${(props) => props.$minWidth || '1200px'};
`
//다른곳에서 설정된게 있으면 그거적용, 없으면 이 설정값적용

//props.$minWidth 값을 적용하려면, <Wrap> 컴포넌트를 사용할 때 $minWidth prop을 전달해주면 됩니다. styled-components는 이 prop을 받아서 min-width 스타일에 반영하게 됩니다.

//   <Main $padding="30px 0"> 내용 <Main/>
//Detail.jsx 참고

export const Main = styled.main`
   width: ${(props) => props.width || '1200px'};
   margin: 0 auto;
   overflow: hidden;
   padding: ${(props) => props.$padding || 0};
`
