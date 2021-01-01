import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import { useMediaQuery } from 'react-responsive';
import axios from './contexts/axios';

import url from "./config";


const Div0 = styled.div`


    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    background-color:${function ({ theme }) { return theme.color3 }};
    z-index:-2;

`


const Div = styled.div`

    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    /* background-color:${function ({ theme }) { return theme.color4 }}; */
    opacity:${function({theme:{backPicOpacity}}){ return backPicOpacity}};

    /* background-color:${function ({ theme }) { return theme.color3 }}; */
    background-image:${function ({ img }) {   return `url(${img})` }};
    
    /* background-image:url("http://192.168.0.103/api/backpicture/downloadbackpicture/aaa"); */
    
    background-size:${function ({ oriantation }) { return oriantation === "horizontal" ? `100% auto` : `auto 100%` }};



    /* background-position: center; */
    /* background-repeat:no-repeat; */
   
    /* background-position: left;
    opacity:0.5; */
   




     /* Center the imagebackground-repeat: no-repeat; 
    /* Do not repeat the image */


 

    /* background-image:     url("https://mernchen.herokuapp.com/api/picture/download/5f197ef0452cc60017f9f488"); */
    /* background-image:   ${function ({ url }) { return ` url(${url}/backpicture/downloadbackpicture/aaa);` }}   ;   */

    overflow:auto;
    z-index:-1;

`


const BackPicture = () => {



    const {
        userAvatar,
        userBackPicture,
        userName,
        axios,
    } = useContext(UserContext)
    // console.log(userBackPicture)
    const {
        backPicOrian,
   
        backPicOpacity,

    } = useContext(ThemeContext)

  

    // const [oriantation, setOriantation] = useState("verticle")
    // useMemo(function () {
    //     userBackPicture && (function () {

    //         const img = new Image();
    //         img.src = userBackPicture;
    //         img.onload = function () {
    //             setOriantation(img.width>=img.height?"horizontal":"verticle")           
    //         }

    //     }())

    // }, [userBackPicture])



    return (
        <>
            <Div0></Div0>
            <Div img={userBackPicture} oriantation={backPicOrian}  />

            {/* {userName && <Div img={userBackPicture} oriantation={backPicOrian} />} */}

        </>
    );
}

export default BackPicture;