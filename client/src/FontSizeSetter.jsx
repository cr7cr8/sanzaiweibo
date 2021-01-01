import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";


const Div = styled.div`

display:flex;
justify-content:center;
align-items:center;
background-color:${function ({ theme }) { return theme.color3 }};
width:100%;
height:100%;

& > button{
    font-size:${function({theme}){return theme.fontSize1 }};
}
`


const FontSizeSetter = ({ fontSize,setFontSize }) => {


    const count = useRef(0);
    useEffect(function () {
        console.log("painting FontSizeSetter --- ", count.current)
        return function () { count.current++; }
    });


    return (

        <Div>
            <button
                 onClick={function(){
                     setFontSize(0.1)
                 }}   

            >Increase 0.1 to {fontSize}rem</button>
           
            <button
             onClick={function(){
                setFontSize(-0.1)
            }}    
            
            >Decrease 0.1 to {fontSize}rem</button>
        </Div>

    );
}

export default FontSizeSetter;