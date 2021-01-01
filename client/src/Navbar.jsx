
import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes , ThemeContext as ThemeStyledContext } from "styled-components";
import { Link } from 'react-router-dom';


import ThemeSetter from './ThemeSetter';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import LogoutForm from './LogoutForm';
import Avatar from './Avatar';
import {Avatar4} from './Avatar2';

import logo from './Images/logo.svg';

import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';




const Div = styled.div`
    z-index:9;
    color:${function ({ theme }) { return theme.color1 }};
    background-color:${function ({ theme }) { return theme.color2 }}; 
   
    display:flex;
    flex-wrap:wrap;
    justify-content:space-around;
    align-items:center;

     position:sticky;
    
    /* left:0px; */
    top:0px; 
    
    
    
    /* width:100%; */
    box-shadow: 0px 0px 2px #5f5f5f,
                /* offset */
                0px 0px 0px 0px #ecf0f3,
                /*bottom right */
                8px -7px 15px #a7aaaf,
                /* top left */
                -8px -8px 15px #ffffff;
               
`

const LogoDiv = styled.div`

    font-size: ${function ({ theme }) { return `${theme.logoTextSize}` }} ;
 
    display:flex;
    width:auto;
    justify-content:space-between;
    align-items:center;
    

    & > div:nth-child(1) > img:nth-child(1){

        width:${function ({ theme }) { return `${theme.logoImageSize}` }}

    }




`

const MenuDiv = styled.div`
    display:flex;


    justify-content:space-around;
    align-items:center;

    /* background-color:tan; */


  & > button {
      font-size:   ${function ({ theme }) { return theme.fontSize1 }};
  }



`





const Navbar = () => {
  


    const {  userName  } = useContext(UserContext)
      


  


    const {

        showLogin, setShowLogin,
        showRegister, setShowRegister,
        showLogout, setShowLogout,
        showThemeSetter, setShowThemeSetter,



    } = useContext(ThemeContext);

    return (
        <>


            <ThemeSetter />
            <LoginForm />
            <RegisterForm />
            <LogoutForm />

            <Div id="navbar">

                <LogoDiv>
                    <div><img src={logo} /></div>
                    <div> <i>山寨微博</i> </div>
                </LogoDiv>
               

                <MenuDiv>
                    {!userName && <button onClick={function () {
                        setShowLogin(true)
                    }}
                    >登录</button>}

                    {!userName && <button onClick={function () {
                        setShowRegister(true)
                    }}
                    >注册</button>}

                    {userName && <button onClick={function () {
                        setShowLogout(true)

                    }}>注销</button>}
                    <button onClick={function () {

                        setShowThemeSetter(true)
                    }}>设置</button>



                    {/* <Avatar /> */}
                    {userName&&<Avatar4 ratio={2} imgOnly={true} />}
                   
                </MenuDiv>

               
            </Div>





        </>


    );
}




export default Navbar;

