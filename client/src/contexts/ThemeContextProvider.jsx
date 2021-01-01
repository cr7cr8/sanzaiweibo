
import React, { createContext, useContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import styled, { ThemeProvider, css } from "styled-components";
import url from "../config";

import jwtDecode from 'jwt-decode';


import { useMediaQuery } from 'react-responsive';

import { UserContext } from './UserContextProvider';
export const ThemeContext = createContext();


const useFontSize = (valuePC, valuePhone) => {

    const isComputer = !useMediaQuery({ query: '(hover: none)' });
    const [fontSizePC, setFontSizePC] = useState(valuePC);
    const [fontSizePhone, setFontSizePhone] = useState(valuePhone);

    function setFontSize(value) {
        isComputer
            ? setFontSizePC((pre) => Math.max((pre + value).toFixed(1), 0.1))
            : setFontSizePhone((pre) => Math.max((pre + value).toFixed(1), 0.1))
    }

    function setBothFontSize(pc, phone) {
        setFontSizePC(pc);
        setFontSizePhone(phone);
    }

    return [fontSizePC, fontSizePhone, setFontSize, setBothFontSize]
}


const ThemeContextProvider = (props) => {

    // const count = useRef(0);
    // useEffect(function () {
    //     console.log("painting ThemeContext --- ", count.current)
    //     return function () { count.current++; }
    // })

    const { userName ,axios } = useContext(UserContext)
    const [themeData, setThemeData] = useState(null);



    useEffect(function () {
        if (themeData) {

            setColor1(themeData.color1);
            setColor2(themeData.color2);
            setColor3(themeData.color3);
            setColor4(themeData.color4);
            setColor5(themeData.color5);


            setBothFontSize1(themeData.fontSizePC1, themeData.fontSizePhone1);
            setBothFontSize2(themeData.fontSizePC2, themeData.fontSizePhone2);
            setBothFontSize3(themeData.fontSizePC3, themeData.fontSizePhone3);
            setBothFontSize4(themeData.fontSizePC4, themeData.fontSizePhone4);
            setBothFontSize5(themeData.fontSizePC5, themeData.fontSizePhone5);


            setLogoImageSizePC(themeData.logoImageSizePC);
            setLogoImageSizePhone(themeData.logoImageSizePhone);

            setLogoTextSizePC(themeData.logoTextSizePC);
            setLogoTextSizePhone(themeData.logoTextSizePhone);

            setAvatarSizePC(themeData.avatarSizePC);
            setAvatarSizePhone(themeData.avatarSizePhone);

            setBackPicOrianPC(themeData.backPicOrianPC);
            setBackPicOrianPhone(themeData.backPicOrianPhone);
            setBackPicOpacity(themeData.backPicOpacity);

            setEditorWidthPC(themeData.editorWidthPC);
            setEditorWidthPhone(themeData.editorWidthPhone);
        }

    }, [themeData])



    const isComputer = !useMediaQuery({ query: '(hover: none)' });



    const [color1, setColor1] = useState("rgb(62,39,35,0.8)");    //Navbar-logo-textColor
    const [color2, setColor2] = useState("rgb(255,224,130,0.8)");  //Navbar-bar-backgourndColor  pic-uploader-pannel
    const [color3, setColor3] = useState("rgb(162,39,135,0.3)");      //LoginForm LogoutForm  RegisterForm App-content AvatarSetter
    const [color4, setColor4] = useState("rgb(255,224,130,0.5)");
    const [color5, setColor5] = useState("rgb(62,39,35,0.5)");


    const [fontSizePC1, fontSizePhone1, setFontSize1, setBothFontSize1] = useFontSize(2, 1.5); //Navbar-button , ThemeSetter-button, self-avatar,FontSizeSetter-button
    const [fontSizePC2, fontSizePhone2, setFontSize2, setBothFontSize2] = useFontSize(2, 1.5); //content-editor-text content-text avatar-with-perpleName


    const [fontSizePC3, fontSizePhone3, setFontSize3, setBothFontSize3] = useFontSize(2, 2);
    const [fontSizePC4, fontSizePhone4, setFontSize4, setBothFontSize4] = useFontSize(2, 2);
    const [fontSizePC5, fontSizePhone5, setFontSize5, setBothFontSize5] = useFontSize(2, 2);


    const [logoImageSizePC, setLogoImageSizePC] = useState(48);
    const [logoImageSizePhone, setLogoImageSizePhone] = useState(48);
    const [logoTextSizePC, setLogoTextSizePC] = useState(1.5);
    const [logoTextSizePhone, setLogoTextSizePhone] = useState(2);

    const [avatarSizePC, setAvatarSizePC] = useState(70);
    const [avatarSizePhone, setAvatarSizePhone] = useState(50);

    const [backPicOrianPC, setBackPicOrianPC] = useState("horizontal");
    const [backPicOrianPhone, setBackPicOrianPhone] = useState("horizontal");
    const [backPicOpacity, setBackPicOpacity] = useState(0.5);

    const [editorWidthPC, setEditorWidthPC] = useState({ width: 80, minWidth: 0, maxWidth: 50000 })
    const [editorWidthPhone, setEditorWidthPhone] = useState({ width: 100, minWidth: 0, maxWidth: 50000 })

    const [ratioRemAndPx,setRatioRemAndPx] = useState(16)



    const setLogoSize = useCallback(function (value) {
        isComputer
            ? (function () {
                setLogoImageSizePC((pre) => Math.max((pre + 20 * value).toFixed(1), 1))
                setLogoTextSizePC((pre) => Math.max((pre + value).toFixed(1), 0.1))
            }())
            : (function () {
                setLogoImageSizePhone((pre) => Math.max((pre + 20 * value).toFixed(1), 1))
                setLogoTextSizePhone((pre) => Math.max((pre + value).toFixed(1), 0.1))
            }())

    }, []);


    const setAvatarSize = useCallback(function (value) {
        isComputer
            ? setAvatarSizePC((pre) => Math.max((pre + value).toFixed(1), 10))
            : setAvatarSizePhone((pre) => Math.max((pre + value).toFixed(1), 10))
    }, []);

    const setBackPicOrian = useCallback(function (value) {
        isComputer
            ? setBackPicOrianPC(value)
            : setBackPicOrianPhone(value)
    }, [])

    const setEditorWidth = useCallback(function (newWidth, newMin, newMax) {
        isComputer
            ? setEditorWidthPC(
                function (pre) {
                    const { width = 0, minWidth = 0, maxWidth = 0 } = pre;
                    return {
                        width: Math.min(Math.max((width + newWidth).toFixed(1), 0), 100),
                        minWidth: Math.max((minWidth + newMin),0),
                        maxWidth: Math.max((maxWidth + newMax),0),
                    }
                })
            : setEditorWidthPhone(
                function (pre) {
                    const { width, minWidth, maxWidth } = pre;
                    return {
                        width: Math.min(Math.max((width + newWidth).toFixed(1), 0), 100),
                        minWidth: Math.max((minWidth + newMin),0),
                        maxWidth: Math.max((maxWidth + newMax),0),
                    }

                })


    }, [])


    const theme = useMemo(function () {

        return {
            color1, color2, color3, color4, color5,
            fontSizePC1, fontSizePC2, fontSizePC3, fontSizePC4, fontSizePC5,
            fontSizePhone1, fontSizePhone2, fontSizePhone3, fontSizePhone4, fontSizePhone5,
            logoImageSizePC, logoImageSizePhone,
            logoTextSizePC, logoTextSizePhone,
            avatarSizePC, avatarSizePhone,
            backPicOrianPC, backPicOrianPhone,
            backPicOpacity,
            editorWidthPC, editorWidthPhone,

            fontSize1: isComputer ? fontSizePC1 + "rem" : fontSizePhone1 + "rem",
            fontSize2: isComputer ? fontSizePC2 + "rem" : fontSizePhone2 + "rem",
            fontSize3: isComputer ? fontSizePC3 + "rem" : fontSizePhone3 + "rem",
            fontSize4: isComputer ? fontSizePC4 + "rem" : fontSizePhone4 + "rem",
            fontSize5: isComputer ? fontSizePC5 + "rem" : fontSizePhone5 + "rem",

            logoImageSize: isComputer ? logoImageSizePC + "px" : logoImageSizePhone + "px",
            logoTextSize: isComputer ? logoTextSizePC + "em" : logoTextSizePhone + "em",

            avatarSize: isComputer ? avatarSizePC + "px" : avatarSizePhone + "px",

            backPicOrian: isComputer ? backPicOrianPC : backPicOrianPhone,

            editorWidth: isComputer ? editorWidthPC.width + "%" : editorWidthPhone.width + "%",
            editorMinWidth: isComputer ? editorWidthPC.minWidth + "px" : editorWidthPhone.minWidth + "px",
            editorMaxWidth: isComputer ? editorWidthPC.maxWidth + "px" : editorWidthPhone.maxWidth + "px",

            ratioRemAndPx,setRatioRemAndPx,
        }
    }, [color1, color2, color3, color4, color5,
        fontSizePC1, fontSizePC2, fontSizePC3, fontSizePC4, fontSizePC5,
        fontSizePhone1, fontSizePhone2, fontSizePhone3, fontSizePhone4, fontSizePhone5,
        logoImageSizePC, logoImageSizePhone,
        logoTextSizePC, logoTextSizePhone,
        avatarSizePC, avatarSizePhone,
        backPicOrianPC, backPicOrianPhone,
        backPicOpacity,
        editorWidthPC, editorWidthPhone,

        ratioRemAndPx,setRatioRemAndPx,
    ]);





    const uploadTheme = useCallback(function () {

        userName && axios.post(`${url}/theme`, { theme })
            .then((response) => { console.log(response.data) })
            .catch((err) => { console.log(err.response) })

    }, [theme])


    const downloadTheme = useCallback(function () {
        userName && axios.get(`${url}/theme`)
            .then(({ data }) => {

            
                data && setThemeData(data.theme)

                // console.log(data)
            })
            .catch(err => {
                console.log(err.response)
            })
    }, [useState]);

    useMemo(downloadTheme, [userName]);






    const [showThemeSetter, setShowThemeSetter] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const [showLogout, setShowLogout] = useState(false);



    return (
        <ThemeContext.Provider value={{

            color1, color2, color3, color4, color5,
            setColor1, setColor2, setColor3, setColor4, setColor5,

            fontSize1: isComputer ? fontSizePC1 : fontSizePhone1, setFontSize1,
            fontSize2: isComputer ? fontSizePC2 : fontSizePhone2, setFontSize2,
            fontSize3: isComputer ? fontSizePC3 : fontSizePhone3, setFontSize3,
            fontSize4: isComputer ? fontSizePC4 : fontSizePhone4, setFontSize4,
            fontSize5: isComputer ? fontSizePC5 : fontSizePhone5, setFontSize5,

            logoImageSize: isComputer ? logoImageSizePC : logoImageSizePhone,
            logoTextSize: isComputer ? logoTextSizePC : logoTextSizePhone,
            setLogoSize,

            avatarSize: isComputer ? avatarSizePC : avatarSizePhone,
            setAvatarSize,

            backPicOrian: isComputer ? backPicOrianPC : backPicOrianPhone,
            setBackPicOrian,

            backPicOpacity,
            setBackPicOpacity,

            editorWidth: isComputer ? editorWidthPC : editorWidthPhone,
            setEditorWidth,

            showThemeSetter, setShowThemeSetter,
            showLogin, setShowLogin,
            showRegister, setShowRegister,
            showLogout, setShowLogout,

            uploadTheme,
            theme,

            ratioRemAndPx,setRatioRemAndPx,

        }}>
            <ThemeProvider theme={theme}>
                {props.children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
}

export default ThemeContextProvider;