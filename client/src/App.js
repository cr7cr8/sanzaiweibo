import React, { useState, useContext, useEffect, useRef, useReducer } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';

import styled, { ThemeProvider, css, keyframes } from "styled-components";



import Navbar from './Navbar';
import Avatar from './Avatar';
import Content from './Content';
import BackPicture from './BackPicture';

import DraftEditor4 from './DraftEditor4';


import ColorPicker from './ThemeSetter';

import Uploader from './Uploader';

import EmojiUpload from './EmojiUpload';

import { UserContext } from './contexts/UserContextProvider';

const Div = styled.div`
    /* background-color:${function ({ theme }) { return theme.color3 }}; */

`



export default function App() {
  
  const { userName } = useContext(UserContext)



  return (

    <>

      <BackPicture />

      <Navbar />

      {/* <EmojiUpload/> */}

      {/* <RichText2/> */}

      {/* <RichText3/> */}

      {/* <DraftEditor /> */}
      {/* <RichEditor2 /> */}
      {/* <DraftEditor2 /> */}
      {/* <DraftEditor3 /> */}

      {userName && <DraftEditor4 />}

      <Content />

      {/* <EditorContextProvider /> */}
      {/* <Content /> */}






    </>
  )

}


