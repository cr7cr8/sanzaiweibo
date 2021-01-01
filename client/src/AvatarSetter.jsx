import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import { useMediaQuery } from 'react-responsive';
import axios from './contexts/axios';



const Pannel = styled.div`

    display: flex; 
    justify-content: center;
    align-items:center;
    width: 100%;
    height:100%;
    overflow:visible;
    flex-direction:column;
    background-color:${function ({ theme }) { return theme.color3 }};


    & > button{
        font-size:${function ({ theme }) { return theme.fontSize1 }};
    }


`



const AvartarSetter = () => {
    const inputRef = useRef()
    const [pic, setPic] = useState()

    const {
        userName,
        uploadAvatar,
    } = useContext(UserContext)

    const {
        setAvatarSize,

    } = useContext(ThemeContext)





    return (
        <Pannel>
            {userName && <>
                <input type="file" style={{ marginBottom: "10px", width: "100%", display: "none" }} ref={inputRef}

                    onClick={function (e) {
                        e.currentTarget.value = null;
                    }}

                    onChange={function (e) {
                        // alert((e.currentTarget.files[0].name).trim());
                        e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)
                            ? setPic(e.currentTarget.files[0])
                            : setPic(null);
                    }}
                />

                <button
                    style={{ marginBottom: "10px" }}
                    onClick={function (e) {
                        setPic(null)
                        inputRef.current.click()
                    }}
                >
                    Pick a image
            </button>


                {pic && <div style={{ marginBottom: "10px" }}>{pic.name}</div>}

                {pic && <img src={pic ? URL.createObjectURL(pic) : ""} width="100px" />}


                <button style={{ marginTop: "10px" }}



                    // disabled={percentage !== "Upload"}
                    onClick={function (e) {
                        pic ? uploadAvatar(pic)
                            : alert("no pic is selected")
                    }}
                >
                    Submit
            </button>

            </>}

            <button
                onClick={function () {
                    setAvatarSize(5)
                }}

            >Bigger</button>
            <button
                onClick={function () {
                    setAvatarSize(-5)
                }}
            >Smaller</button>


        </Pannel>


    );
}

export default AvartarSetter;


