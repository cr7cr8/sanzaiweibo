import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import { useMediaQuery } from 'react-responsive';


import { Link } from 'react-router-dom';
import ThemeSetter from './ThemeSetter';


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




const LoginForm = () => {


    const isComputer = !useMediaQuery({ query: '(hover: none)' });

    const {
    //    userName, setUserName,

        login,
    } = useContext(UserContext)

    const {

        showLogin, setShowLogin,

    } = useContext(ThemeContext)

    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");


    return (

        showLogin &&
        <Div>

            <DivSub isComputer={isComputer}>

                <div>
                    <button
                        onClick={function (e) {
                            setShowLogin(false)

                        }}
                    >close</button>
                </div>

                <div>
                    <label htmlFor="login">login</label>
                    <br />
                    <input id="login" type="text" placeholder="" value={userName}
                        onChange={function (e) {
                            setUserName(e.currentTarget.value);
                        }}

                    />
                </div>

                <div>
                    <label htmlFor="password">password</label>
                    <br />
                    <input id="password" type="password" placeholder=" " value={password}
                        onChange={function (e) {
                            setPassword(e.currentTarget.value);
                        }}

                    />
                </div>

                <div>
                    <button style={{ marginTop: "10px" }}

                        onClick={function () {
                            login(userName,password)
                        }}
                    >Login</button>
                </div>

            </DivSub>


        </Div>



    );
}

export default LoginForm;