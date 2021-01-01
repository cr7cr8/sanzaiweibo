import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import { useMediaQuery } from 'react-responsive';
import axios from './contexts/axios';


import url from "./config";
import { object } from 'prop-types';


import {
    isMobile,
    isFirefox,
    isChrome,
    browserName,
    engineName,
} from "react-device-detect";

export function Avatar4_({ peopleName, ratio = 1, imgOnly = false, ...props }) {


    const { userName, userAvatar } = useContext(UserContext)

    const { fontSize1, fontSize2, ratioRemAndPx, setRatioRemAndPx, } = useContext(ThemeContext)


    const [avatarSize, setAvatarSize] = useState(0)


    const [avatarSourceSize, setAvatarSourceSize] = useState({ width: "auto", height: "auto", oriantation: true, /*shiftX: "translateX(0)"*/ })

    const colorRandom = useRef("#" + ((1 << 24) * Math.random() | 0).toString(16))


    useEffect(function () {


        const size = peopleName
            ? parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[1]).fontSize)
            : parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[0]).fontSize)

        //   alert(parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[0]).fontSize))



        // alert(size)

        console.log(size)



        setAvatarSize(size * ratio)

        const ratio_size = parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[2]).fontSize)

        const aaa = ratio_size / fontSize2

        //   alert(  ratio_size/fontSize2 )
        setRatioRemAndPx(ratio_size / fontSize2)

    }, [fontSize1, fontSize2, peopleName, userAvatar])

    useEffect(function () {

        const ratio_size = parseFloat(getComputedStyle(document.getElementsByClassName("_avatar_size_")[2]).fontSize)
        //  alert((ratio_size) + "==="+ fontSize2 + "==="+ratio_size/fontSize2)
    })



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
                    fontSize: avatarSize / 2.5 + "px",
                    //    fontSize: peopleName?fontSize2+"rem":fontSize1+"rem",
                    verticalAlign: "text-bottom",
                    boxShadow: !peopleName ? "0px 0px 6px #5f5f5f" : "",

                    // borderStyle: "solid",
                    borderWidth: "0px",
                    // borderBlockColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),

                }}
                {...props}
            >
                <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start" }}>
                    <img

                        src={
                            peopleName
                                ? `${url}/avatar/downloadavatar/${peopleName}`
                                : userName
                                    ? userAvatar
                                    : `${url}/avatar/downloadavatar/__unknown_person_?__`

                        }
                        width={avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}
                        height={!avatarSourceSize.oriantation ? "auto" : avatarSize + "px"}

                        // width={avatarSize + "px"}
                        // height={avatarSize + "px"}


                        style={{

                            //transform: avatarSourceSize.shiftX,
                            //transform: "translateX(-25%)"
                            objectFit: "cover"

                        }}
                        // alt={peopleName || userName}
                        download={peopleName || userName}
                        title={peopleName || userName}
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

            {imgOnly ? "" : peopleName || userName}



            <div style={{ display: "none", fontSize: fontSize1 + "rem", }} className="_avatar_size_">@</div>
            <div style={{ display: "none", fontSize: fontSize2 + "rem", }} className="_avatar_size_">@</div>
            <div style={{ display: "none", fontSize: fontSize2 + "rem", }} className="_avatar_size_">@</div>
        </>
    )

}

export function LongMentionOffHead({ imgurl, peopleName, children, ...props }) {

    const { fontSize1, fontSize2, ratioRemAndPx, setRatioRemAndPx, } = useContext(ThemeContext)

    const { userName, contentList, deleteContentList, friendsList, setFriendsList, uploadFriendsList } = useContext(UserContext)

    return (
        <span

            style={{
                display: "inline",
                //        backgroundColor: "#b7e1fc",
                borderTopLeftRadius: "1000px", borderBottomLeftRadius: "1000px",
                //  borderRadius:"1000px"
                //            verticalAlign: "middle",
            }}

            onClick={function (e) {

                if (userName) {

                    if(userName===peopleName){  alert("无法取关你自己") ;return null}

                    console.log(friendsList)
                    const isFriendBefore = friendsList.includes(peopleName)

                    const answer = isFriendBefore
                        ? window.confirm("取关" + peopleName)
                        : window.confirm("关注 " + peopleName)


                    if (isFriendBefore && answer) {
                        setFriendsList(pre => {

                            const arr = pre.filter(people => { return people !== peopleName })

                            console.log(arr)
                            uploadFriendsList(arr)
                            return arr
                        })
                    }


                    else if (answer && !isFriendBefore) {
                        setFriendsList(
                            pre => {

                                const arr = [...new Set([...pre, peopleName])]
                                console.log(arr)
                                uploadFriendsList(arr)
                                return arr
                            }
                        )
                    }


                }



            }}

        >

            <div style={{


                //   lineHeight: "0px",
                height: isMobile && isFirefox ? fontSize2 * 21.6 * 1.2 + "px" : fontSize2 * 16 * 1.2 + "px",
                width: isMobile && isFirefox ? fontSize2 * 21.6 * 1.2 + "px" : fontSize2 * 16 * 1.2 + "px",
                display: "inline-flex",
                alignItems: "center",

                color: "rgba(200,0,0,0)",
                //     backgroundColor: "purple",
                borderRadius: "1000px",
                backgroundPosition: "center center",
                backgroundImage: imgurl || `url(${url}/avatar/downloadavatar/${peopleName})`,
                backgroundRepeat: "no-repeat",


                backgroundSize: "cover",
                boxShadow: "rgb(180, 180, 180) -2px 0px 3px",
            }}>
                {/* {node.children.map(item => item.data)} */}
                {children}
            </div>

        </span>
    )

}

export function LongMentionOffBody({ children, ...props }) {

    const { fontSize1, fontSize2, ratioRemAndPx, setRatioRemAndPx, } = useContext(ThemeContext)
    return (

        <span

            style={{

                lineHeight: "0px",
                height: fontSize2 * 16 * 1.2 + "px",
                display: "inline-flex",
                alignItems: "center",
                display: "inline",
                //  backgroundColor: "#b7e1fc",

                //   paddingLeft:10+"px",
                //   paddingRight:fontSize2/2+"rem",

                //    borderTopRightRadius: fontSize2*16+"px", borderBottomRightRadius: fontSize2*16+"px",
                //    verticalAlign: "middle",
            }}>
            {children}
        </span>

    )



}

export function Avatar5({ peopleName, ratio = 1, imgOnly = false, ...props }) {


    return (
        <>
            <LongMentionOffHead></LongMentionOffHead>
        </>


    )

}

export function Avatar4({ peopleName, imgOnly = true, ...props }) {

    const { userName, userAvatar, contentList, deleteContentList, friendsList, setFriendsList, uploadFriendsList } = useContext(UserContext)
    const { fontSize1, fontSize2, ratioRemAndPx, setRatioRemAndPx, avatarSize } = useContext(ThemeContext)

    return (
        <span {...props}   >



            <img src={peopleName ? `${url}/avatar/downloadavatar/${peopleName}` : userAvatar}

                style={{
                    display: "inline-block",
                    borderRadius: "1000px",
                    height: avatarSize + "px",
                    width: avatarSize + "px",
                    boxShadow: !peopleName ? "0px 0px 6px #5f5f5f" : "",
                    verticalAlign: "middle",
                    backgroundColor:"#" + ((1 << 24) * Math.random() | 0).toString(16),
                }}

                onClick={function () {


                    if (userName && peopleName) {
                        console.log(friendsList)

                        if(userName===peopleName){  alert("无法取关你自己") ;return null}

                        const isFriendBefore = friendsList.includes(peopleName)

                        const answer = isFriendBefore
                            ? window.confirm("取关" + peopleName)
                            : window.confirm("关注 " + peopleName)


                        if (isFriendBefore && answer) {
                            setFriendsList(pre => {

                                const arr = pre.filter(people => { return people !== peopleName })

                                console.log(arr)
                                uploadFriendsList(arr)
                                return arr
                            })
                        }


                        else if (answer && !isFriendBefore) {
                            setFriendsList(
                                pre => {

                                    const arr = [...new Set([...pre, peopleName])]
                                    console.log(arr)
                                    uploadFriendsList(arr)
                                    return arr
                                }
                            )
                        }


                    }




                }}

            />
            <span style={{ fontSize: fontSize1 + "rem",      verticalAlign: "middle", }} >{imgOnly ? "" : peopleName || userName}</span>
        </span>

    )

}