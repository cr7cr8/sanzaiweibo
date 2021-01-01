
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { ThemeContext } from './contexts/ThemeContextProvider';
import { UserContext } from './contexts/UserContextProvider';

import url from "./config";

import Button from "./Button"


import { EditorState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import Editor from "draft-js-plugins-editor"


import { stateToHTML } from 'draft-js-export-html';



import createLinkPlugin, { linkStyleMap } from './LinkPlugin';


import createEmojiPlugin from './EmojiPlugin'


import createMentionPlugin from './MentionPlugin';

import createImagePlugin from './ImagePlugin';

import {
    isMobile,
    isFirefox,
    isChrome,
    browserName,
    engineName,
} from "react-device-detect";



import Immutable from 'immutable'

const { imagePlugin, ImagePluginPanel } = createImagePlugin()
const { emojiPlugin, insertEmoji, getEmoji, getEmojiAll, EmojiPluginPanel } = createEmojiPlugin()


const mentionPlugin = createMentionPlugin()
const linkPlugin = createLinkPlugin()








const panelMappingObj = { EmojiPluginPanel: <EmojiPluginPanel />, ImagePluginPanel: <ImagePluginPanel /> }

export const EditorContext = createContext();


export default function DraftEditor4() {


    const isComputer = !isMobile
    const [showPlugin, setShowPlugin] = useState({

        EmojiPluginPanel: false,
        ImagePluginPanel: false,
    })

    function toggleShow(...props) {

        setShowPlugin(function (pre) {

            return {
                ...pre,
                [props[0]]: props.length === 1
                    ? !pre[props[0]]
                    : props[1]
            }
        })
    }


    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const [preHtml, setPreHtml] = useState(stateToHTML(editorState.getCurrentContent()))

    const editor = useRef()
    const [readOnly, setReadOnly] = useState(false)

    const { fontSize2, editorWidth } = useContext(ThemeContext)
    const { userName, uploadContentList, friendsList } = useContext(UserContext)
    useMemo(function () { mentionPlugin.setFriendsList(friendsList) }, [friendsList])



    const { width, minWidth, maxWidth } = editorWidth
    const width_ = width + "%", minWidth_ = minWidth + "px", maxWidth_ = maxWidth + "px"

    const [panelArr, setPanelArr] = useState([
        { key: genKey(), panelName: "ImagePluginPanel" },
        { key: genKey(), panelName: "EmojiPluginPanel" },

    ])

    function stateToPreHtml(es) {

        const preHtml_ = stateToHTML(
            es.getCurrentContent(),
            {


                defaultBlockTag: "div",

                blockStyleFn: function (block) {

                    //const data = block.getData().toObject()
                    const type = block.getType()

                    if (type === "colorBlock") {
                        return {
                            //element: "img", //not working redered as "<p>"
                            attributes: {
                                className: "colorBlockClass",
                                // src: data.imgUrl,
                                // aas: "fffd",
                            },
                            style: {
                                color: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                                // display: "block",
                                // marginLeft: "12px",
                                // marginRight: "auto",
                            }
                        }
                    }
                },

                blockRenderers: {
                    imageBlock: function (block) {
                        const text = block.getText()
                        const data = block.getData().toObject()
                        const type = block.getType()

                        //  return `<img src=${data.imgUrl} style=max-width:300px;display:block;margin-left:auto;margin-right:auto;/>`

                        return `<div><imgtag id=${data.imgId} style=max-width:100%;display:block;margin-left:auto;margin-right:auto;/></div>`


                    }
                },
                inlineStyles: {



                    linkStyle: { style: linkStyleMap.linkStyle, },



                },

                entityStyleFn: function (entity) {
                    const { type, data, mutablity } = entity.toObject()

                    if ((type === "EMOJI") && (isComputer)) {

                        return {
                            element: "span",

                            style: {

                                backgroundColor: "transparent",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center center",
                                backgroundSize: "contain",
                                display: "inline-block",

                                textAlign: "right",
                                verticalAlign: "middle",

                                color: "rgba(0,0,0,0)",
                                backgroundImage: data.url,








                                minWidth: `${fontSize2 * 16}px`,
                                //  width: `${fontSize2 * 16}px`,
                                height: `${fontSize2 * 16}px`,

                                //   backgroundColor:"transparent",

                            }
                        }


                    }
                    if ((type === "EMOJI") && (!isComputer)) {
                        return {
                            element: "emoji_phone",
                            attributes: {
                                background_image: data.url,
                            },
                        }



                    }

                    if ((type === "linkOff")) {

                        return {
                            element: "mylink",
                            attributes: {
                                host: data.linkHost,
                                address: data.linkAddress,
                            },
                            style: { display: "hidden" }
                        }

                    }
                    if ((type === "linkOn")) {

                        return {
                            element: "mylink",
                            attributes: {
                                host: data.linkHost,
                                address: data.linkAddress,
                            },
                            style: { display: "hidden" }
                        }

                    }
                    if (type === "shortMentionOff") {
                        return {
                            element: "shortMentionoff",
                        }

                    }

                    if (type === "longMentionOff_HEAD") {

                        return {

                            element: "longmentionoff_head",
                            attributes: {
                                imgurl: data.imgurl,
                                person: data.person,
                            },
                            style: {
                                // display: "inline",
                                // backgroundColor: "#b7e1fc", borderTopLeftRadius: "1000px", borderBottomLeftRadius: "1000px",
                                // verticalAlign: "middle",

                            }
                        }
                    }
                    if (type === "longMentionOff_BODY") {

                        return {

                            element: "longmentionoff_body",
                            attributes: {
                                imgurl: data.imgurl,
                                person: data.person,
                            },

                        }

                    }
                    if (type === 'photo') {
                        const data = entity.getData();
                        return {
                            element: 'img',
                            attributes: {
                                src: data.src,
                            },
                            style: {
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                            },

                        };

                    }



                },

            }
        )
        setPreHtml(preHtml_)
    }






    useEffect(function () {

        stateToPreHtml(editorState)

    }, [preHtml])





    return (
        <EditorContext.Provider value={{ showPlugin, toggleShow }}>



            <div style={{
                width: width_,
                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                margin: "auto",
            }}>
                {
                    panelArr.map(function (component, index) {
                        const Compo = panelMappingObj[component.panelName];

                        return <div key={component.key}>{Compo}</div>
                        // return <Compo key={index} />
                    })}
            </div>

            <div style={{
                width: width_,
                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                margin: "auto",
            }}>

                {isMobile || <Button
                    onClick={function (e) {


                        setPanelArr(pre => {
                            let dropItem = [];
                            return (
                                [...pre.filter(function (item) {

                                    if (item.panelName === "EmojiPluginPanel") {
                                        dropItem.push(item)
                                    }

                                    return item.panelName !== "EmojiPluginPanel"
                                }), ...dropItem]
                            )

                        })
                        toggleShow("EmojiPluginPanel")


                    }}
                >表情</Button>}
                <Button
                    onClick={function (e) {

                        setPanelArr(pre => {
                            let dropItem = [];
                            return (
                                [...pre.filter(function (item) {

                                    if (item.panelName === "ImagePluginPanel") {
                                        dropItem.push(item)
                                    }

                                    return item.panelName !== "ImagePluginPanel"
                                }), ...dropItem]
                            )

                        })

                        toggleShow("ImagePluginPanel")
                    }}

                >图片</Button>
                <Button
                    onClick={function (e) {

                        setEditorState(inserBotomBlock(editorState))
                    }}
                >加行</Button>


            </div>


            <div
                style={{
                    backgroundColor: "#f9f9f9",
                    borderStyle: "solid",
                    borderWidth: "0px",
                    borderTopWidth: "1px",
                    borderBottomWidth: "1px",
                    minHeight: "5rem",
                    fontSize: fontSize2 + "rem",
                    width: width_,
                    minWidth: minWidth_,
                    maxWidth_: maxWidth_,
                    margin: "auto",

                    whiteSpace: "pre-line",
                }}
                onClick={function () {
                    editor.current.focus()
                }}
            >
                <Editor
                    editorState={editorState}

                    //    customStyleMap={customStyleMap} //customStyleFn={customStyleFns}      

                    customStyleFn={function (item, block) {


                    }}

                    blockRenderMap={Immutable.Map({


                        'imageBlock': {
                            element: "figure",
                        },


                    })}

                    blockRendererFn={function (block) {

                        const text = block.getText()
                        const data = block.getData().toObject()
                        const type = block.getType()

                        if (type === "imageBlock") {


                            return {
                                component: function (props) {

                                    const { block, contentState } = props;

                                    return <img

                                        src={data.imgData}
                                        id={data.imgId}
                                        style={{

                                            maxWidth: editorWidth.width * 0.3 + "%",
                                            display: "block",
                                            marginLeft: "auto",
                                            marginRight: "auto"
                                        }} />



                                },
                                editable: false
                            }
                        }

                        else { return null }

                    }}

                    blockStyleFn={function (blockContent) {

                        if (blockContent.getType() === "unstyled") {
                            return "UnstyledBlockClass"
                        }




                    }}

                    ref={function (element) { editor.current = element; }}

                    plugins={[emojiPlugin, linkPlugin, mentionPlugin, imagePlugin,]}



                    handleKeyCommand={function (command, editorState, evenTimeStamp, { getEditorState }) {


                        const newState = RichUtils.handleKeyCommand(editorState, command);
                        if (newState) {
                            setEditorState(newState)
                            return 'handled';
                        }
                        return 'not-handled';
                    }}


                    onChange={function (newState) {

                        stateToPreHtml(newState)
                        setEditorState(newState)

                    }}


                    readOnly={readOnly}
                    stripPastedStyles={true}

                    handlePastedText={function (text, html, editorState) {



                    }}
                />



            </div>


            <hr />

            <div style={{
                fontSize: fontSize2 + "rem",

                margin: "auto",
                width: width_,
                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                //  backgroundColor: "lightgreen",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                // whiteSpace: "break-spaces",
            }}>
                <Button onClick={
                    function (e) {
                        e.persist()
                        e.target.disabled = true

                        setReadOnly(true)
                        uploadContentList(preHtml)
                            .then(function () {

                                setEditorState(EditorState.createEmpty())
                                e.target.disabled = false;
                                setReadOnly(false)
                            })
                            .catch(e => {
                                e.target.disabled = false;
                                setReadOnly(false)

                            })

                    }

                }>发送</Button>





            </div>





        </EditorContext.Provider>
    )


}


export function CommentEditor({ articleId, setCommentObj, setContentList, ...props }) {



    const isComputer = !isMobile
    const [showPlugin, setShowPlugin] = useState({

        EmojiPluginPanel: false,
        ImagePluginPanel: false,
    })

    function toggleShow(...props) {

        setShowPlugin(function (pre) {

            return {
                ...pre,
                [props[0]]: props.length === 1
                    ? !pre[props[0]]
                    : props[1]
            }
        })
    }


    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const [preHtml, setPreHtml] = useState(stateToHTML(editorState.getCurrentContent()))

    const editor = useRef()
    const [readOnly, setReadOnly] = useState(false)

    const { fontSize2, editorWidth } = useContext(ThemeContext)
    const { userName, uploadContentList, friendsList, axios } = useContext(UserContext)
    useMemo(function () { mentionPlugin.setFriendsList(friendsList) }, [friendsList])



    const { width, minWidth, maxWidth } = editorWidth
    const width_ = width + "%", minWidth_ = minWidth + "px", maxWidth_ = maxWidth + "px"

    const [panelArr, setPanelArr] = useState([
        { key: genKey(), panelName: "ImagePluginPanel" },
        { key: genKey(), panelName: "EmojiPluginPanel" },

    ])

    function stateToPreHtml(es) {

        const preHtml_ = stateToHTML(
            es.getCurrentContent(),
            {


                defaultBlockTag: "div",




                entityStyleFn: function (entity) {
                    const { type, data, mutablity } = entity.toObject()

                    if ((type === "EMOJI") && (isComputer)) {

                        return {
                            element: "span",

                            style: {

                                backgroundColor: "transparent",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center center",
                                backgroundSize: "contain",
                                display: "inline-block",

                                textAlign: "right",
                                verticalAlign: "middle",

                                color: "rgba(0,0,0,0)",
                                backgroundImage: data.url,








                                minWidth: `${fontSize2 * 16}px`,
                                //  width: `${fontSize2 * 16}px`,
                                height: `${fontSize2 * 16}px`,

                                //   backgroundColor:"transparent",

                            }
                        }


                    }
                    if ((type === "EMOJI") && (!isComputer)) {
                        return {
                            element: "emoji_phone",
                            attributes: {
                                background_image: data.url,
                            },
                        }



                    }

                    if ((type === "linkOff")) {

                        return {
                            element: "mylink",
                            attributes: {
                                host: data.linkHost,
                                address: data.linkAddress,
                            },
                            style: { display: "hidden" }
                        }

                    }
                    if ((type === "linkOn")) {

                        return {
                            element: "mylink",
                            attributes: {
                                host: data.linkHost,
                                address: data.linkAddress,
                            },
                            style: { display: "hidden" }
                        }

                    }
                    if (type === "shortMentionOff") {
                        return {
                            element: "shortMentionoff",
                        }

                    }

                    if (type === "longMentionOff_HEAD") {

                        return {

                            element: "longmentionoff_head",
                            attributes: {
                                imgurl: data.imgurl,
                                person: data.person,
                            },
                            style: {
                                // display: "inline",
                                // backgroundColor: "#b7e1fc", borderTopLeftRadius: "1000px", borderBottomLeftRadius: "1000px",
                                // verticalAlign: "middle",

                            }
                        }
                    }
                    if (type === "longMentionOff_BODY") {

                        return {

                            element: "longmentionoff_body",
                            attributes: {
                                imgurl: data.imgurl,
                                person: data.person,
                            },

                        }

                    }
                    if (type === 'photo') {
                        const data = entity.getData();
                        return {
                            element: 'img',
                            attributes: {
                                src: data.src,
                            },
                            style: {
                                display: "block",
                                marginLeft: "auto",
                                marginRight: "auto",
                            },

                        };

                    }



                },

            }
        )
        setPreHtml(preHtml_)
    }


    useEffect(function () {

        stateToPreHtml(editorState)

    }, [preHtml])





    return (
        <EditorContext.Provider value={{ showPlugin, toggleShow }}>



            <div style={{
                width: "100%",
                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                margin: "auto",
                paddingLeft: "5%", paddingRight: "5%",
            }}>
                {
                    panelArr.map(function (component, index) {
                        const Compo = panelMappingObj[component.panelName];

                        return <div key={component.key}>{Compo}</div>
                        // return <Compo key={index} />
                    })}
            </div>

            <div style={{
                width: width_,

                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                //  margin: "auto",
            }}>




            </div>


            <div
                style={{
                    backgroundColor: "#f9f9f9",
                    borderStyle: "solid",
                    borderWidth: "0px",
                    borderTopWidth: "1px",
                    borderBottomWidth: "1px",

                    fontSize: fontSize2 + "rem",
                    // width: width_,
                    // minWidth: minWidth_,
                    // maxWidth_: maxWidth_,
                    width: "90%",
                    margin: "auto",

                    whiteSpace: "pre-line",
                }}
                onClick={function () {
                    editor.current.focus()
                }}
            >
                <Editor
                    editorState={editorState}

                    blockStyleFn={function (blockContent) {

                        if (blockContent.getType() === "unstyled") {
                            return "UnstyledBlockClass"
                        }

                    }}

                    ref={function (element) { editor.current = element; }}

                    plugins={[emojiPlugin, linkPlugin, mentionPlugin, imagePlugin,]}



                    handleKeyCommand={function (command, editorState, evenTimeStamp, { getEditorState }) {


                        const newState = RichUtils.handleKeyCommand(editorState, command);
                        if (newState) {
                            setEditorState(newState)
                            return 'handled';
                        }
                        return 'not-handled';
                    }}


                    onChange={function (newState) {

                        stateToPreHtml(newState)
                        setEditorState(newState)

                    }}


                    readOnly={readOnly}
                    stripPastedStyles={true}

                    handlePastedText={function (text, html, editorState) { }}




                />



            </div>


            {/* <hr /> */}

            <div style={{
                fontSize: fontSize2 + "rem",

                margin: "auto",
                //    width: width_,
                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                //  backgroundColor: "lightgreen",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                paddingLeft: "5%", paddingRight: "5%",
                // whiteSpace: "break-spaces",
            }}>

                {isMobile || <Button
                    onClick={function (e) {


                        setPanelArr(pre => {
                            let dropItem = [];
                            return (
                                [...pre.filter(function (item) {

                                    if (item.panelName === "EmojiPluginPanel") {
                                        dropItem.push(item)
                                    }

                                    return item.panelName !== "EmojiPluginPanel"
                                }), ...dropItem]
                            )

                        })
                        toggleShow("EmojiPluginPanel")


                    }}
                >表情</Button>}



                <Button onClick={
                    function (e) {
                        e.persist()
                        e.target.disabled = true

                        setReadOnly(true)

                        return userName && axios.post(`${url}/comment`, {
                            articleId: articleId,
                            ownerName: userName,
                            content: preHtml,
                        }).then(function (response) {
                            setEditorState(EditorState.createEmpty())
                            e.target.disabled = false;
                            setReadOnly(false)

                            setCommentObj(pre => {

                                const poster = response.data
                                pre[poster.articleId].push(response.data)

                                pre[poster.articleId] = pre[poster.articleId].sort(function (item1, item2) {
                                    if (item1._id > item2._id) { return -1 }
                                    else if (item1._id < item2._id) { return 1 }
                                    else { return 0 }
                                })

                                return { ...pre }
                            })
                            return response
                        }).then(function () {

                            setContentList(pre => {

                                const arr = pre.map(function (content) {
                                    if (content._id !== articleId) {
                                        return content
                                    }
                                    else {
                                        content.commentNum++
                                        return content
                                    }
                                })
                                return arr
                            })

                        })
                        // .catch(e => {
                        //     e.target.disabled = false;
                        //     setReadOnly(false)

                        // })

                    }

                }>发送</Button>





            </div>





        </EditorContext.Provider>
    )


}


export function SubCommentEditor({ commentId, setSubCommentObj, ...props }) {

    const isComputer = !isMobile
    const [showPlugin, setShowPlugin] = useState({

        EmojiPluginPanel: false,
        ImagePluginPanel: false,
    })

    function toggleShow(...props) {

        setShowPlugin(function (pre) {

            return {
                ...pre,
                [props[0]]: props.length === 1
                    ? !pre[props[0]]
                    : props[1]
            }
        })
    }


    const [editorState, setEditorState] = useState(EditorState.createEmpty())

    const [preHtml, setPreHtml] = useState(stateToHTML(editorState.getCurrentContent()))

    const editor = useRef()
    const [readOnly, setReadOnly] = useState(false)

    const { fontSize2, editorWidth } = useContext(ThemeContext)
    const { userName, uploadContentList, friendsList, axios } = useContext(UserContext)
    useMemo(function () { mentionPlugin.setFriendsList(friendsList) }, [friendsList])



    const { width, minWidth, maxWidth } = editorWidth
    const width_ = width + "%", minWidth_ = minWidth + "px", maxWidth_ = maxWidth + "px"

    const [panelArr, setPanelArr] = useState([
        { key: genKey(), panelName: "ImagePluginPanel" },
        { key: genKey(), panelName: "EmojiPluginPanel" },

    ])

    function stateToPreHtml(es) {

        const preHtml_ = stateToHTML(
            es.getCurrentContent(),
            {


                defaultBlockTag: "div",




                entityStyleFn: function (entity) {
                    const { type, data, mutablity } = entity.toObject()

                    if ((type === "EMOJI") && (isComputer)) {

                        return {
                            element: "span",

                            style: {

                                backgroundColor: "transparent",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center center",
                                backgroundSize: "contain",
                                display: "inline-block",

                                textAlign: "right",
                                verticalAlign: "middle",

                                color: "rgba(0,0,0,0)",
                                backgroundImage: data.url,








                                minWidth: `${fontSize2 * 16}px`,
                                //  width: `${fontSize2 * 16}px`,
                                height: `${fontSize2 * 16}px`,

                                //   backgroundColor:"transparent",

                            }
                        }


                    }
                    if ((type === "EMOJI") && (!isComputer)) {
                        return {
                            element: "emoji_phone",
                            attributes: {
                                background_image: data.url,
                            },
                        }



                    }

                    if ((type === "linkOff")) {

                        return {
                            element: "mylink",
                            attributes: {
                                host: data.linkHost,
                                address: data.linkAddress,
                            },
                            style: { display: "hidden" }
                        }

                    }
                    if ((type === "linkOn")) {

                        return {
                            element: "mylink",
                            attributes: {
                                host: data.linkHost,
                                address: data.linkAddress,
                            },
                            style: { display: "hidden" }
                        }

                    }
                    if (type === "shortMentionOff") {
                        return {
                            element: "shortMentionoff",
                        }

                    }

                    if (type === "longMentionOff_HEAD") {

                        return {

                            element: "longmentionoff_head",
                            attributes: {
                                imgurl: data.imgurl,
                                person: data.person,
                            },
                            style: {
                                // display: "inline",
                                // backgroundColor: "#b7e1fc", borderTopLeftRadius: "1000px", borderBottomLeftRadius: "1000px",
                                // verticalAlign: "middle",

                            }
                        }
                    }
                    if (type === "longMentionOff_BODY") {

                        return {

                            element: "longmentionoff_body",
                            attributes: {
                                imgurl: data.imgurl,
                                person: data.person,
                            },

                        }

                    }




                },

            }
        )
        setPreHtml(preHtml_)
    }


    useEffect(function () {

        stateToPreHtml(editorState)

    }, [preHtml])





    return (
        <EditorContext.Provider value={{ showPlugin, toggleShow }}>



            <div style={{
                width: "100%",
                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                margin: "auto",
                paddingLeft: "5%", paddingRight: "5%",
            }}>
                {
                    panelArr.map(function (component, index) {
                        const Compo = panelMappingObj[component.panelName];

                        return <div key={component.key}>{Compo}</div>
                        // return <Compo key={index} />
                    })}
            </div>

            <div style={{
                width: width_,

                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                //  margin: "auto",
            }}>




            </div>


            <div
                style={{
                    backgroundColor: "#f9f9f9",
                    borderStyle: "solid",
                    borderWidth: "0px",
                    borderTopWidth: "1px",
                    borderBottomWidth: "1px",

                    fontSize: fontSize2 + "rem",
                    // width: width_,
                    // minWidth: minWidth_,
                    // maxWidth_: maxWidth_,
                    width: "90%",
                    margin: "auto",

                    whiteSpace: "pre-line",
                }}
                onClick={function () {
                    editor.current.focus()
                }}
            >
                <Editor
                    editorState={editorState}

                    blockStyleFn={function (blockContent) {

                        if (blockContent.getType() === "unstyled") {
                            return "UnstyledBlockClass"
                        }

                    }}

                    ref={function (element) { editor.current = element; }}

                    plugins={[emojiPlugin, linkPlugin, mentionPlugin, imagePlugin,]}



                    handleKeyCommand={function (command, editorState, evenTimeStamp, { getEditorState }) {


                        const newState = RichUtils.handleKeyCommand(editorState, command);
                        if (newState) {
                            setEditorState(newState)
                            return 'handled';
                        }
                        return 'not-handled';
                    }}


                    onChange={function (newState) {

                        stateToPreHtml(newState)
                        setEditorState(newState)

                    }}


                    readOnly={readOnly}
                    stripPastedStyles={true}

                    handlePastedText={function (text, html, editorState) { }}




                />



            </div>


            {/* <hr /> */}

            <div style={{
                fontSize: fontSize2 + "rem",

                margin: "auto",
                //    width: width_,
                minWidth: minWidth_,
                maxWidth_: maxWidth_,
                //  backgroundColor: "lightgreen",
                wordBreak: "break-all",
                whiteSpace: "pre-wrap",
                paddingLeft: "5%", paddingRight: "5%",
                // whiteSpace: "break-spaces",
            }}>

                {isMobile || <Button
                    onClick={function (e) {


                        setPanelArr(pre => {
                            let dropItem = [];
                            return (
                                [...pre.filter(function (item) {

                                    if (item.panelName === "EmojiPluginPanel") {
                                        dropItem.push(item)
                                    }

                                    return item.panelName !== "EmojiPluginPanel"
                                }), ...dropItem]
                            )

                        })
                        toggleShow("EmojiPluginPanel")


                    }}
                >表情</Button>}



                <Button onClick={
                    function (e) {
                        e.persist()
                        e.target.disabled = true

                        setReadOnly(true)

                        return userName && axios.post(`${url}/subcomment`, {
                            commentId: commentId,
                            ownerName: userName,
                            content: preHtml,
                        }).then(function (response) {
                            setEditorState(EditorState.createEmpty())
                            e.target.disabled = false;
                            setReadOnly(false)

                            setSubCommentObj(pre => {

                                const poster = response.data
                                if (!Array.isArray(pre[commentId])) {
                                    pre[commentId] = []
                                }

                                pre[commentId].push(poster)
                                pre[commentId] = pre[commentId].sort(function (item1, item2) {
                                    if (item1._id > item2._id) { return -1 }
                                    else if (item1._id < item2._id) { return 1 }
                                    else { return 0 }
                                })

                                return { ...pre }
                            })
                            return response
                        })

                    }

                }>发送</Button>





            </div>





        </EditorContext.Provider>
    )
}




function inserBotomBlock(editorState, typeName = "unstyled", text = "") {

    const blockMap = editorState.getCurrentContent().getBlockMap().toSeq()

    // const lastBlock = blockMap.last()
    console.log([...blockMap])

    // const blocksBefore = blockMap.takeUntil(function (v) {
    //     return v === lastBlock.getKey()
    // })


    const blockKey = genKey()

    const newBlocks = [
        //      [lastBlock.getKey(), lastBlock],

        [blockKey, new ContentBlock({
            key: blockKey,
            type: typeName,
            text: text,
        })]
    ]

    const newBlockMap = blockMap.concat(newBlocks).toOrderedMap()


    let newContentState = editorState.getCurrentContent().merge({
        blockMap: newBlockMap,
        selectionBefore: editorState.getSelection(),
        selectionAfter: editorState.getSelection().merge({
            anchorKey: blockKey,
            anchorOffset: 0,
            focusKey: blockKey,
            focusOffset: 0,
            isBackward: false,
            hasFocus: true,
        }),
    })

    return EditorState.push(editorState, newContentState, 'insert-fragment');


}


function genKey(length = 4) {

    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}



