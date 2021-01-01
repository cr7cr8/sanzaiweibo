import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import { useMediaQuery } from 'react-responsive';
import axios from './contexts/axios';


import url from "./config";
import { object } from 'prop-types';



export default function Avatar2({ peopleName, ...props }) {

    const {
        userAvatar,
        userState,
        axios,
    } = useContext(UserContext)

    const {
        avatarSize,
        fontSize2,
    } = useContext(ThemeContext)



    const [avatarImg, setAvatarImg] = useState()
    const [avatarSourceSize, setAvatarSourceSize] = useState({ width: avatarSize, height: avatarSize, oriantation: true, shiftX: "translateX(0)" })


    useEffect(function () {



        axios.get(`${url}/avatar/downloadavatar/${peopleName}`,
            {
                responseType: 'arraybuffer',
                onDownloadProgress: function (progressEvent) {
                    //  console.log("Downloading backPicture --- " + (progressEvent.loaded * 100 / progressEvent.total).toFixed(2))
                }
            }


        ).then((response) => {


            const base64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
            );


            const img = new Image();
            img.src = "data:" + response.headers["content-type"] + ";base64," + base64;

            img.onload = function () {


                setAvatarImg("data:" + response.headers["content-type"] + ";base64," + base64)
                setAvatarSourceSize({
                    width: img.width,
                    height: img.height,
                    oriantation: img.width >= img.height,
                    get shiftX() {
                        return `translateX(-${this.oriantation ? img.width * avatarSize / img.height / 2 - avatarSize / 2 : 0}px)`
                    },
                })


            }


        })
            .catch(err => { console.log(err.response) })



    }, [peopleName, avatarSize])

    useEffect(function () {

        // console.log( parseFloat( getComputedStyle(    document.getElementsByClassName("aaa")[0]   ).fontSize )   )                
        // if (!defaultSize) {
        //     const size = parseFloat(getComputedStyle(document.getElementsByClassName("aaa")[0]).fontSize)

        //     if (size !== avatarSize) {
        //         setAvatarSize_(size)
        //     }
        // }
        // parseFloat(getComputedStyle(document.documentElement).fontSize);
    })


    return (
        <>
            <div
                style={{
                    width: avatarSize + "px",
                    height: avatarSize + "px",
                    backgroundColor: "orange",
                    overflow: "hidden",
                    display: "inline-block",
                    borderRadius: "1000px",
                    fontSize: "0rem",
                }}
            >
                <img src={avatarImg}
                    width={avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}
                    height={!avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}
                    style={{
                        //  wdith: avatarSize + "px",
                        //  height: avatarSize + "px",
                        // objectFit: "contain",
                        // margin:"auto",
                        // display:"flex-inline",
                        //transform:oriantation?`translateX(-${avatarSize/2}px)`:"translateX(0px)",
                        transform: avatarSourceSize.shiftX

                        //avatarSourceSize.oriantation?`translateX(-${avatarSourceSize.width*avatarSize/avatarSourceSize.height/2 - avatarSize/2}px)`:"translateX(0px)",

                    }}

                />
            </div>

            {/* <div style={{ display: "none", fontSize: "2rem", }} className="aaa">A</div> */}
        </>
    );
}

export function Avatar3({ peopleName, ratio = 1.2, ...props }) {


    const { axios } = useContext(UserContext)

    const { fontSize2 } = useContext(ThemeContext)


    const [avatarImg, setAvatarImg] = useState()
    const [avatarSize, setAvatarSize] = useState(0)


    const [avatarSourceSize, setAvatarSourceSize] = useState({ width: avatarSize, height: avatarSize, oriantation: true, shiftX: "translateX(0)" })

    const colorRandom = useRef("#" + ((1 << 24) * Math.random() | 0).toString(16))




    useEffect(function () {

        axios.get(`${url}/avatar/downloadavatar/${peopleName}`,
            {
                responseType: 'arraybuffer',
                onDownloadProgress: function (progressEvent) {
                    //  console.log("Downloading backPicture --- " + (progressEvent.loaded * 100 / progressEvent.total).toFixed(2))
                }
            }


        ).then((response) => {


            const base64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
            );


            const img = new Image();
            img.src = "data:" + response.headers["content-type"] + ";base64," + base64;

            img.onload = function () {


                setAvatarImg("data:" + response.headers["content-type"] + ";base64," + base64)
                setAvatarSourceSize({
                    width: img.width,
                    height: img.height,
                    oriantation: img.width >= img.height,
                    get shiftX() {
                        return `translateX(-${this.oriantation ? img.width * avatarSize / img.height / 2 - avatarSize / 2 : 0}px)`
                    },
                })


            }


        })
            .catch(err => { console.log(err.response) })



    }, [fontSize2])



    useEffect(function () {


        const size = parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[0]).fontSize)
        setAvatarSize(size * ratio)


    }, [fontSize2])



    return (
        <>


            <div
                style={{
                    width: avatarSize + "px",
                    height: avatarSize + "px",
                    backgroundColor: colorRandom.current,//"#" + ((1 << 24) * Math.random() | 0).toString(16),
                    overflow: "hidden",
                    display: "inline-block",
                    borderRadius: "1000px",
                    fontSize: avatarSize + "px",
                    verticalAlign: "text-bottom",
                    // borderStyle: "solid",
                    // borderWidth: "1px",
                    // borderBlockColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),

                }}
            >
                <img src={avatarImg}
                    width={avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}
                    height={!avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}
                    style={{
                        //   zIndex:-10,
                        transform: avatarSourceSize.shiftX,
                        //   position:"absolute",
                    }}

                />

            </div>

            {peopleName}



            <div style={{ display: "none", fontSize: fontSize2 + "rem", }} className="_avatar_size_">A</div>
        </>
    )

}

export function Avatar4({ peopleName, ratio = 1, imgOnly = false, ...props }) {


    const { userState, userAvatar } = useContext(UserContext)

    const { fontSize1, fontSize2 } = useContext(ThemeContext)


    const [avatarSize, setAvatarSize] = useState(0)


    const [avatarSourceSize, setAvatarSourceSize] = useState({ width: "auto", height: "auto", oriantation: true, /*shiftX: "translateX(0)"*/ })

    const colorRandom = useRef("#" + ((1 << 24) * Math.random() | 0).toString(16))


    useEffect(function () {


        const size = peopleName
            ? parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[1]).fontSize)
            : parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[0]).fontSize)

        //   alert(parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[0]).fontSize))

        console.log(size)

        setAvatarSize(size * ratio)


    }, [fontSize1, fontSize2, peopleName, userAvatar])



    return (
        <>


            <div
                style={{
                    width: avatarSize + "px",
                    height: avatarSize + "px",
                    backgroundColor: colorRandom.current,//"#" + ((1 << 24) * Math.random() | 0).toString(16),
                    overflow: "hidden",
                    display: "inline-block",
                    borderRadius: "1000px",
                    fontSize: avatarSize/2.5 + "px",
                //    fontSize: peopleName?fontSize2+"rem":fontSize1+"rem",
                    verticalAlign: "text-bottom",
                    boxShadow: !peopleName ? "0px 0px 6px #5f5f5f" : "",

                    // borderStyle: "solid",
                    borderWidth: "0px",
                    // borderBlockColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),

                }}
            >
                <div style={{ display: "flex", justifyContent: "center",alignItems:"flex-start" }}>
                    <img

                        src={
                            peopleName
                                ? `${url}/avatar/downloadavatar/${peopleName}`
                                : userState
                                    ?userAvatar
                                    :`${url}/avatar/downloadavatar/__?__`
                                
                        }
                        width={avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}
                        height={!avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}

                        // width={avatarSize + "px"}
                        // height={avatarSize + "px"}


                        style={{

                            //transform: avatarSourceSize.shiftX,
                            //transform: "translateX(-25%)"
                             objectFit:"cover"

                        }}
                        // alt={peopleName || userState &&userState.userName}
                        download={peopleName || userState && userState.userName}
                        title={peopleName || userState && userState.userName}
                        crossOrigin="anonymous"
                        onLoad={function (e) {
                            const img = e.currentTarget

                            setAvatarSourceSize({
                                // width: img.width,
                                // height: img.height,
                                oriantation: img.width >= img.height,
                                // get shiftX() {
                                //     return `translateX(-${this.oriantation ? img.width * avatarSize / img.height / 2 - avatarSize / 2 : 0}px)`
                                // },
                            })





                        }}

                    /></div>

            </div>

            {imgOnly ? "" : peopleName || userState && userState.userName || ""}



            <div style={{ display: "none", fontSize: fontSize1 + "rem", }} className="_avatar_size_">A</div>
            <div style={{ display: "none", fontSize: fontSize2 + "rem", }} className="_avatar_size_">A</div>
        </>
    )

}