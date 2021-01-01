
import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { Link } from 'react-router-dom';

import ThemeSetter from './ThemeSetter';



import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';




import { useMediaQuery } from 'react-responsive';

const Div = styled.div`
    z-index:10;
    display: flex;
    background-color: rgb(25,25,25,0.2);
    justify-content: center;
    align-items: center;
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0; 
    top: 0;

 
`

const DivSub = styled.div`
    display: flex;
    position:relative;
    flex-direction:column;
    width: ${function ({ isComputer }) { return isComputer ? "50%" : "80%" }};
    height:${function ({ isComputer }) { return isComputer ? "70%" : "90%" }};
    background-color: ${function ({ theme }) { return theme.color3 }};
    /* justify-content: center; */
    align-items: center;
    font-size:${function ({ theme }) { return theme.fontSize1 }};
    box-shadow: 0px 0px 2px #5f5f5f,
                /* offset */
                0px 0px 0px 5px #ecf0f3,
                /*bottom right */
                8px 8px 15px #a7aaaf,
                /* top left */
                -8px -8px 15px #ffffff;

    & > div:nth-child(1){     
             align-self:flex-end;
    }
    & > div >input , label,  button:nth-child(1), button:nth-child(2) {
        font-size: ${function ({ theme }) { return theme.fontSize1 }};
    }
`

const LogoutForm = () => {

    const isComputer = !useMediaQuery({ query: '(hover: none)' });

    const {
     

        logout,
    } = useContext(UserContext)

    const {

        showLogout, setShowLogout,


    } = useContext(ThemeContext)


    return (

        showLogout && <Div>
            <DivSub  isComputer={isComputer}>

                <div>
                    <button
                        onClick={function (e) {
                            setShowLogout(false)

                        }}
                    >close</button>
                </div>

                <div>

                        <button
                        
                        onClick={function(e){
                            logout()
                        }}
                        
                        >OK</button>
                        <button   onClick={function (e) {
                            setShowLogout(false)

                        }}>Cancel</button>

                </div>
            </DivSub>

        </Div>


    );
}

export default LogoutForm;