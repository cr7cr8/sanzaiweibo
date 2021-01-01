import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';

import { compareAsc, format, formatDistanceToNow, } from 'date-fns'

import { zhCN } from 'date-fns/locale'

import DraftEditor4, { CommentEditor, SubCommentEditor } from './DraftEditor4';
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



    const {
        userName, contentList, setContentList, downloadContentList,
        deleteContentList, friendsList, setFriendsList, uploadFriendsList,
        countContentNum, contentNum,
    } = useContext(UserContext)

    const { fontSize2, editorWidth, color4 } = useContext(ThemeContext)


    const { width, minWidth, maxWidth } = editorWidth
    const width_ = width + "%", minWidth_ = minWidth + "px", maxWidth_ = maxWidth + "px"

    const isComputer = !isMobile

    const [commentObj, setCommentObj] = useState({})
    const [subCommentObj, setSubCommentObj] = useState({})


    //  const [commentNumObj,setCommentNumObj] = useState({})

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

                }
                if (node.name === "longmentionoff_body") {

                    return <LongMentionOffBody key={index}>{node.children.map(item => item.data)}</LongMentionOffBody>


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
                marginBottom: "20px",
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
                            <div style={{ paddingTop: "5px", paddingBottom: "5px", verticalAlign: "middle", }}>



                                <Avatar4 peopleName={poster.ownerName} imgOnly={false} />






                                <span style={{ fontSize: fontSize2 * 0.7 + "rem" }}>
                                    &nbsp;&nbsp;{formatDistanceToNow(new Date(poster.postingTime), { locale: zhCN, })}
                                </span>



                                {userName === poster.ownerName && <Button
                                    style={{  /*verticalAlign:"middle",*/ }}


                                    onClick={function (e) {
                                        e.persist()
                                        e.target.disabled = true
                                        deleteContentList(poster._id)
                                            .catch(function (err) {
                                                console.log(err)
                                                e.target.disabled = false
                                            })


                                    }}
                                >删除</Button>}

                                {userName && <Button

                                    onClick={function (e) {
                                        e.persist()
                                        e.target.disabled = true;
                                        axios.get(`${url}/comment/count/${poster._id}`).then(({ data }) => {

                                            setContentList(pre => {
                                                const arr = pre.map(function (content) {
                                                    if (content._id !== poster._id) {
                                                        return content
                                                    }
                                                    else {
                                                        content.commentNum = data
                                                        return content
                                                    }
                                                })
                                                return arr
                                            })

                                        })

                                        if (commentObj[poster._id]) {

                                            setCommentObj(pre => {
                                                const obj = pre;
                                                delete obj[poster._id]


                                                return { ...obj }
                                            })

                                            e.target.disabled = false;
                                        }
                                        else {
                                            axios.get(`${url}/comment/${poster._id}`).then(({ data }) => {

                                                setCommentObj((pre) => {
                                                    const obj = { [poster._id]: data }


                                                    return { ...pre, ...obj }
                                                })
                                                e.target.disabled = false;

                                                setSubCommentObj((pre) => {

                                                    data.forEach(function (comment) {

                                                        //       pre[comment._id] = new Array(Number(comment.subCommentNum))
                                                        pre[comment._id] = (Number(comment.subCommentNum))

                                                    })

                                                    console.log(pre)
                                                    return { ...pre }
                                                })
                                            })
                                        }
                                    }}

                                >评论{poster.commentNum}</Button>}

                            </div>




                            <div>
                                {renderHtml(poster.content)}


                                <div>
                                    {commentObj[poster._id] && <hr style={{ marginBottom: "5px" }} />}


                                    {/* {commentObj[poster._id] && <LongMentionOffHead peopleName={userName}> @</LongMentionOffHead>} */}
                                    {commentObj[poster._id] && <CommentEditor articleId={poster._id} setCommentObj={setCommentObj} setContentList={setContentList} />}

                                    {(function () {

                                        if (commentObj[poster._id]) {
                                            return commentObj[poster._id].sort(
                                                function (item1, item2) {
                                                    if (item1._id > item2._id) { return -1 }
                                                    else if (item1._id < item2._id) { return 1 }
                                                    else { return 0 }
                                                }

                                            ).map((data, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div style={{ verticalAlign: "middle", paddingLeft: "5%", paddingRight: "5%" }}>
                                                            <LongMentionOffHead peopleName={data.ownerName}> @</LongMentionOffHead>
                                                            <LongMentionOffBody>{data.ownerName}</LongMentionOffBody>
                                                            <span style={{ fontSize: fontSize2 * 0.7 + "rem" }}>
                                                                &nbsp;&nbsp;{formatDistanceToNow(new Date(data.postingTime), { locale: zhCN, })}
                                                            </span>


                                                            {userName === data.ownerName && <Button

                                                                onClick={function (e) {
                                                                    // e.target.disabled = true
                                                                    axios.get(`${url}/comment/delete/${data._id}`).then(() => {

                                                                        setCommentObj(pre => {
                                                                            const arr = pre[poster._id].filter(item => {
                                                                                return item._id !== data._id
                                                                            })
                                                                            pre[poster._id] = arr

                                                                            return { ...pre }

                                                                        })

                                                                        setContentList(pre => {
                                                                            const arr = pre.map(function (content) {
                                                                                if (content._id !== poster._id) {
                                                                                    return content
                                                                                }
                                                                                else {
                                                                                    content.commentNum--
                                                                                    return content
                                                                                }
                                                                            })
                                                                            return arr
                                                                        })


                                                                    })

                                                                }}

                                                            >删除</Button>}
                                                            <Button

                                                                onClick={function () {
                                                                    const commentId = data._id

                                                                    if (Array.isArray(subCommentObj[commentId])) {
                                                                        axios.get(`${url}/subcomment/count/${commentId}`).then((response) => {
                                                                            setSubCommentObj(pre => {
                                                                                pre[commentId] = Number(response.data)
                                                                                return { ...pre }
                                                                            })

                                                                        })
                                                                    }
                                                                    else {
                                                                        axios.get(`${url}/subcomment/${commentId}`).then((response) => {

                                                                            const subcommentsArr = response.data

                                                                            setSubCommentObj(pre => {
                                                                                if (!Array.isArray(pre[commentId])) {
                                                                                    pre[commentId] = []
                                                                                }
                                                                                pre[commentId] = [...subcommentsArr]

                                                                                return { ...pre }
                                                                            })

                                                                        })
                                                                    }

                                                                }}


                                                            >回复{Array.isArray(subCommentObj[data._id]) ? subCommentObj[data._id].length : subCommentObj[data._id]}</Button>

                                                        </div>

                                                        <div style={{ paddingLeft: "5%", paddingRight: "5%" }}>



                                                            {renderHtml(data.content)}


                                                            {Array.isArray(subCommentObj[data._id]) && <SubCommentEditor commentId={data._id} setSubCommentObj={setSubCommentObj} />}


                                                            <div style={{ paddingLeft: "5%", paddingRight: "5%" }}>

                                                                {(function () {
                                                                    if (Array.isArray(subCommentObj[data._id])) {
                                                                        return subCommentObj[data._id].map(function (subcomment, index) {
                                                                            return (
                                                                                <span key={index}>
                                                                                    <LongMentionOffHead peopleName={subcomment.ownerName}> @</LongMentionOffHead>
                                                                                    <LongMentionOffBody>{subcomment.ownerName}</LongMentionOffBody>

                                                                                    <span style={{ fontSize: fontSize2 * 0.7 + "rem" }}>
                                                                                        &nbsp;&nbsp;{formatDistanceToNow(new Date(subcomment.postingTime), { locale: zhCN, })}
                                                                                    </span>


                                                                                    {userName === subcomment.ownerName && <Button

                                                                                        onClick={function () {
                                                                                            axios.get(`${url}/subcomment/delete/${subcomment._id}`).then((response) => {

                                                                                                setSubCommentObj(pre => {

                                                                                                    pre[data._id] = pre[data._id].filter(item => {
                                                                                                        return item._id !== subcomment._id
                                                                                                    })

                                                                                                    return { ...pre }
                                                                                                })
                                                                                            })
                                                                                        }}

                                                                                    >删除</Button>}
                                                                                    {renderHtml(subcomment.content)}
                                                                                </span>
                                                                            )
                                                                        })
                                                                    }
                                                                }())}


                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </div>

                                                )
                                            })
                                        }

                                    }())}
                                </div>
                            </div>


                        </div>


                    )
                })}


                {userName && <Button style={{ width: "100%" }}

                    onClick={
                        function (e) {
                            e.persist()
                            e.target.disabled = true
                            downloadContentList().then(function () {
                                e.target.disabled = false
                            })
                            countContentNum()
                        }

                    }
                >加载更多{contentList.length}/{contentNum}</Button>}
            </div>



        </>
    );
}
