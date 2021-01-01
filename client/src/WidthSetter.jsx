
import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";

import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import Button from './Button';




const Div = styled.div`

display:flex;
justify-content:center;
align-items:center;
background-color:${function ({ theme }) { return theme.color3 }};
width:100%;
height:100%;
flex-direction:column;

& > button{
    font-size:${function ({ theme }) { return theme.fontSize1 }};
}
`



export default function WidthSetter(...props) {


    const { } = useContext(ThemeContext)
    const { setEditorWidth, editorWidth } = useContext(ThemeContext)

    return (

        <Div>


       
                <Button
                    onClick={function (e) {
                        setEditorWidth(5, 0, 0)
                    }}
                >
                    Add width {editorWidth.width}%
            </Button>

         
                <Button
                    onClick={function (e) {
                        setEditorWidth(-5, 0, 0)
                    }}
                >
                    Reduce width {editorWidth.width}%
            </Button> 
        
                <Button
                    onClick={function (e) {
                        setEditorWidth(0, 10, 0)
                    }}
                >
                    Add minWidth {editorWidth.minWidth}px
            </Button> 
        
                <Button
                    onClick={function (e) {
                        setEditorWidth(0, -10, 0)
                    }}
                >
                    reduce minWidth {editorWidth.minWidth}px
            </Button> 

        </Div>

    );
}

