
import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes, ThemeContext as ThemeStyledContext } from "styled-components";

import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';


const Button_ = styled.button`
      font-size:   ${function ({ theme }) { return theme.fontSize1 }};
`


export default function Button(props) {


    const {

        fontSize1,


    } = useContext(ThemeContext);

    return (
            <Button_ {...props}>{props.children}</Button_>
    );
}

