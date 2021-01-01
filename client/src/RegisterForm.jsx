import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { Link } from 'react-router-dom';

import ThemeSetter from './ThemeSetter';

import logo from './Images/logo.svg';


import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
// import { ThemeContext } from 'styled-components';



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

    & > div >input , label,  button:nth-child(1) {
        font-size: ${function ({ theme }) { return theme.fontSize1 }};
    }
    & > div >input  {
        width: ${function ({ isComputer }) { return isComputer ? "auto" : "100%" }};
    }
                
`


const RegisterForm = () => {

    const isComputer = !useMediaQuery({ query: '(hover: none)' });

    const {
   

        register,
    } = useContext(UserContext)


    const {

        showRegister, setShowRegister, theme,

    } = useContext(ThemeContext)

    const [userName, setuserName] = useState("");
    const [password, setPassword] = useState("");

    return (
        showRegister &&
        <Div>

            <DivSub isComputer={isComputer}>


                <div>
                    <button
                        onClick={function (e) {
                            setShowRegister(false)

                        }}
                    >close</button>
                </div>

                <div>
                    <label htmlFor="login">login</label>
                    <br />
                    <input id="login" type="text" value={userName} placeholder=" "
                        onChange={function (e) {
                            setuserName(e.currentTarget.value)
                        }}

                    />
                </div>

                <div>
                    <label htmlFor="password">password</label>
                    <br />
                    <input id="password" type="password" value={password} placeholder=" "
                        onChange={function (e) {
                            setPassword(e.currentTarget.value)
                        }}
                    />
                </div>

                <div>
                    <label htmlFor="password">password again</label>
                    <br />
                    <input id="password" type="password" placeholder=" " />
                </div>

                <div>
                    <button style={{ marginTop: "10px" }}

                        onClick={function () {
                            register(userName, password, theme);
                        }}

                    >Submit</button>
                </div>

            </DivSub>
        </Div>


    );
}

export default RegisterForm;