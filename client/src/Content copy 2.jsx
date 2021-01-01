import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';


import {
    isMobile,
    isFirefox,
    isChrome,
    browserName,
    engineName,
} from "react-device-detect";
import axios from './contexts/axios';


import Immutable from 'immutable'
import Button from "./Button"

import { Avatar4, LongMentionOffHead, LongMentionOffBody } from "./Avatar2"


import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ImgTag from './ImgTag';
import url from "./config";
import { generateKeyPair } from 'crypto';





export default function Content() {



    const { userName, contentList, deleteContentList, friendsList, setFriendsList, uploadFriendsList } = useContext(UserContext)

    const { fontSize2, editorWidth, color4 } = useContext(ThemeContext)


    const { width, minWidth, maxWidth } = editorWidth
    const width_ = width + "%", minWidth_ = minWidth + "px", maxWidth_ = maxWidth + "px"

    const isComputer = !isMobile



    function renderHtml(contentToRent = "Nothing to Render") {



        while (contentToRent.indexOf("&nbsp;") >= 0) {
            contentToRent = contentToRent.replace("&nbsp;", " ")
        }


        return ReactHtmlParser(contentToRent, {
            transform: function (node, index) {


                if (node.name === "imgtag") {
                    return <ImgTag key={index} id={node.attribs.id} style={{ maxWidth: width * 0.3 + "%", display: "block", marginLeft: "auto", marginRight: "auto" }}

                        onClick={function (e) {

                            return e.target.style.maxWidth === "100%" ? e.target.style.maxWidth = width * 0.3 + "%" : e.target.style.maxWidth = "100%"
                        }}

                    />
                    //  return <img key={index} id={node.attribs.id}  src={`${url}/picture/downloadpicture/${node.attribs.id}`}  style={{ maxWidth: "100%", display: "block", marginLeft: "auto", marginRight: "auto" }} />
                }
                if (node.name === "shortmentionoff") {

                    return <span
                        key={index}
                        style={{
                            display: "inline",
                            backgroundColor: "#AAF",
                            //           verticalAlign: "middle",
                            position: "relative",
                        }}>
                        <div style={{
                            lineHeight: "0px",
                            //    height: fontSize2 * 16 * 1.2 + "px",
                            minWidth: fontSize2 * 16 * 1.2 + "px",
                            display: "inline-block",

                        }}>
                            {node.children.map(item => item.data)}
                            {/* node.children[0].data */}


                        </div>
                    </span>
                }
                if (node.name === "longmentionoff_head") {

                    return (

                        <LongMentionOffHead key={index} peopleName={node.attribs.person}>
                            {node.children.map(item => item.data)}
                        </LongMentionOffHead>
                    )
                    return <span
                        key={index}

                        onClick={function (e) {

                            if (userName) {
                                console.log(friendsList)
                                const isFriendBefore = friendsList.includes(node.attribs.person)

                                const answer = isFriendBefore
                                    ? window.confirm("删除" + node.attribs.person)
                                    : window.confirm("添加 " + node.attribs.person)


                                if (isFriendBefore && answer) {
                                    setFriendsList(pre => {

                                        const arr = pre.filter(people => { return people !== node.attribs.person })

                                        console.log(arr)
                                        uploadFriendsList(arr)
                                        return arr
                                    })
                                }


                                else if (answer && !isFriendBefore) {
                                    setFriendsList(
                                        pre => {

                                            const arr = [...new Set([...pre, node.attribs.person])]
                                            console.log(arr)
                                            uploadFriendsList(arr)
                                            return arr
                                        }
                                    )
                                }


                            }

                            //    alert(node.attribs.person)

                        }}

                        style={{
                            display: "inline",
                            backgroundColor: "#b7e1fc", borderTopLeftRadius: "1000px", borderBottomLeftRadius: "1000px",
                            //            verticalAlign: "middle",
                        }}>
                        <div style={{


                            //   lineHeight: "0px",
                            height: isMobile && isFirefox ? fontSize2 * 21.6 * 1.2 + "px" : fontSize2 * 16 * 1.2 + "px",
                            width: isMobile && isFirefox ? fontSize2 * 21.6 * 1.2 + "px" : fontSize2 * 16 * 1.2 + "px",
                            display: "inline-flex",
                            alignItems: "center",

                            color: "rgba(200,0,0,0)",
                            backgroundColor: "purple",
                            borderRadius: "1000px",
                            backgroundPosition: "center center",
                            backgroundImage: node.attribs.imgurl,
                            backgroundRepeat: "no-repeat",

                            //  backgroundSize: isMobile && isFirefox ?  "cover" : "contain",
                            backgroundSize: "cover",
                            boxShadow: "rgb(180, 180, 180) -2px 0px 3px",
                        }}>
                            {node.children.map(item => item.data)}
                            {/* node.children[0].data */}
                        </div>

                    </span>


                }
                if (node.name === "longmentionoff_body") {

                    return <LongMentionOffBody key={index}>{node.children.map(item => item.data)}</LongMentionOffBody>

                    return <span
                        key={index}
                        style={{

                            lineHeight: "0px",
                            height: fontSize2 * 16 * 1.2 + "px",
                            display: "inline-flex",
                            alignItems: "center",
                            display: "inline",
                            backgroundColor: "#b7e1fc",
                            //    verticalAlign: "middle",
                        }}>
                        {node.children.map(item => item.data)}
                    </span>
                }


                if (node.name === "mylink") {
                    return <a
                        target="_blank"
                        key={index}
                        style={{ color: "blue", fontSize: Math.max(fontSize2 * 0.7, 0.7) + "rem", cursor: "pointer" }}

                        onClick={function (e) {
                            e.target.innerHTML === node.attribs.host && e.preventDefault()
                            e.target.innerHTML = node.attribs.address
                            e.target.href = node.attribs.address.substr(1)
                        }}
                    >
                        {node.attribs.host}
                    </a>

                }
                if ((node.name === "emoji_phone") && (isComputer)) {


                    return <span
                        key={index}
                        style={{

                            backgroundColor: "wheat",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "left center",
                            backgroundSize: "contain",
                            display: "inline-block",
                            //   width: "48px",
                            // height: "48px",
                            //   textAlign: "right",
                            verticalAlign: "middle",


                            color: "rgba(0,0,0,0)",
                            backgroundImage: node.attribs.background_image,

                            //   width: `${fontSize2 * 16}px`,
                            minWidth: fontSize2 * 16 + "px",
                            height: `${fontSize2 * 16}px`,
                        }}


                    >{node.children[0].data}</span>
                }
                if ((node.name === "emoji_phone") && (!isComputer)) {
                    return <span key={index}   >{node.children[0].data}</span>
                }
            }
        })


    }



    return (
        <>

            <div style={{
                fontSize: fontSize2 + "rem",

                margin: "auto",
                width: width_,
                minWidth: minWidth_,
                maxWidth_: maxWidth_,

                wordBreak: "break-all",
                whiteSpace: "pre-wrap",

            }}>
                {contentList.map((poster, index) => {


                    return (

                        <div key={poster._id} id={poster._id}
                            style={{
                                //  backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                                backgroundColor: color4,

                                marginBottom: "10px",

                            }}>
                            <div style={{paddingTop:"5px", paddingBottom:"5px"}}>

                             

                            <Avatar4 peopleName={poster.ownerName} imgOnly={false}/>

                                {userName === poster.ownerName && <Button
                                style={{
                                    verticalAlign:"middle",
                                }}
                                    onClick={function (e) {
                                        e.persist()
                                        e.target.disabled = true
                                        deleteContentList(poster._id)
                                            .catch(function (err) {
                                                console.log(err)
                                                e.target.disabled = false
                                            })


                                    }}
                                >delete</Button>}
                            </div>
                            <hr />
                            <div>
                                {renderHtml(poster.content)}
                            </div>


                        </div>


                    )
                })}

                {/* <Button onClick={
                    function (e) {
                        // axios.get(`${url}/article/aaa`
                        axios.get(`${url}/article/all`

                        ).then((response) => {

                            setHtml(pre => {


                                let obj1 = {};
                                let obj2 = {};
                                pre.forEach(function (poster) {
                                    obj1 = { ...obj1, [poster._id]: poster }
                                })


                                response.data.forEach(function (poster) {
                                    obj2 = { ...obj2, [poster._id]: poster }
                                })


                                let obj3 = { ...obj1, ...obj2 }

                                let arr = []
                                Object.keys(obj3).forEach(item => {

                                    arr.push(obj3[item])
                                })


                                return [...arr].sort(function (item1, item2) {
                                    if (item1._id > item2._id) { return -1 }
                                    else if (item1._id < item2._id) { return 1 }
                                    else { return 0 }
                                })


                            })

                        })
                    }

                }>获取</Button> */}


            </div>



        </>
    );
}
