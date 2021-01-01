

import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";


import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';

// import colorsys, { rgb2Cmyk } from 'colorsys';
import { useMediaQuery } from 'react-responsive';


import ColorSetter from "./ColorSetter";
import FontSizeSetter from "./FontSizeSetter";
import AvatarSetter from "./AvatarSetter";
import BackPictureSetter from './BackPictureSetter';
import WidthSetter from './WidthSetter';

let pos = "editorWidth";

const ThemeSetter = () => {
    const isComputer = !useMediaQuery({ query: '(hover: none)' });




    const {

        color1, color2, color3, color4,
        setColor1, setColor2, setColor3, setColor4,

        logoImageSize, logoTextSize,
        setLogoSize,

        fontSize1, fontSize2, fontSize3, fontSize4, fontSize5,
        setFontSize1, setFontSize2, setFontSize3, setFontSize4, setFontSize5,

        showThemeSetter, setShowThemeSetter,

        uploadTheme,


    } = useContext(ThemeContext);

    const [index, setIndex] = useState(pos)


    return (
        showThemeSetter &&
        <div style={{
            display: "flex",
            //   backgroundColor: "rgb(255,100,255,0.2)",


            justifyContent: "center",
            alignItems: "center",
            position: "fixed",
            width: "100%", left: "0px", top: "0px",
            height: "100%",
            zIndex: 10,
        }}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isComputer ? "center" : "flex-start", //"center",   

                //alignItems:  "flex-start", //"center",   
                //alignItems: "center", 


                // backgroundColor: "rgb(255,255,255,0.5)",
                width: isComputer ? "80%" : "90%", height: isComputer ? "80%" : "90%",
                overflow: "auto",
                boxShadow: `
                0px 0px 2px #5f5f5f,
                /* offset */
                0px 0px 0px 5px #ecf0f3,
                /*bottom right */
                8px 8px 15px #a7aaaf,
                /* top left */
                -8px -8px 15px #ffffff`,


                backgroundColor: color3,
            }}>

                <div style={{
                    display: "flex", position: "sticky",
                    top: "0", left: "0", justifyContent: "center", width: "100%",
                    backgroundColor: color2,
                }}>

                    <select defaultValue={pos}

                        style={{
                            fontSize: fontSize1 + "rem"
                        }}

                        onChange={function (e) {
                            pos = String(e.target.value)
                            setIndex(pos)

                        }}
                    >
                        <option value="color1" >logo字颜色</option>
                        <option value="color2" >导航条颜色</option>
                        <option value="color3" >背景图颜色</option>
                        <option value="color4" >微博块颜色</option>


                        <option value="0" >logo大小</option>
                        <option value="1" >按钮大小</option>
                        <option value="2" >字体大小</option>
                        <option value="3" >没有在用</option>
                        <option value="4" >没有在用</option>
                        <option value="5" >没有在用</option>

                        <option value="avatar">头像图标</option>
                        <option value="backPicture">背景图片</option>
                        <option value="editorWidth">微博块宽度</option>
                    </select>
                    <button style={{ position: "absolute", right: "0px", fontSize: fontSize1 + "rem" }} onClick={function () {
                        setShowThemeSetter(false);
                        uploadTheme();
                    }}
                    >关闭</button>
                </div>


                {index === "color1" && <ColorSetter color={color1} setColor={setColor1} />}
                {index === "color2" && <ColorSetter color={color2} setColor={setColor2} />}
                {index === "color3" && <ColorSetter color={color3} setColor={setColor3} />}
                {index === "color4" && <ColorSetter color={color4} setColor={setColor4} />}

                {index === "0" && <FontSizeSetter fontSize={logoTextSize} setFontSize={setLogoSize} />}
                {index === "1" && <FontSizeSetter fontSize={fontSize1} setFontSize={setFontSize1} />}
                {index === "2" && <FontSizeSetter fontSize={fontSize2} setFontSize={setFontSize2} />}
                {index === "3" && <FontSizeSetter fontSize={fontSize3} setFontSize={setFontSize3} />}
                {index === "4" && <FontSizeSetter fontSize={fontSize4} setFontSize={setFontSize4} />}
                {index === "5" && <FontSizeSetter fontSize={fontSize5} setFontSize={setFontSize5} />}

                {index === "avatar" && <AvatarSetter />}
                {index === "backPicture" && <BackPictureSetter />}
                {index === "editorWidth" && <WidthSetter />}


            </div>
        </div>

    );
}

export default ThemeSetter;
