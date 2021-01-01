
import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { ThemeContext } from './contexts/ThemeContextProvider';
import { UserContext } from './contexts/UserContextProvider';



import Button from "./Button"

import Avatar2, { Avatar4 } from "./Avatar2"

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
import axios from './contexts/axios';


import Immutable from 'immutable'


import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import ImgTag from './ImgTag';
import url from "./config";

const { imagePlugin, ImagePluginPanel } = createImagePlugin()
const { emojiPlugin, insertEmoji, getEmoji, getEmojiAll, EmojiPluginPanel } = createEmojiPlugin()


const mentionPlugin = createMentionPlugin()
const linkPlugin = createLinkPlugin()


const customStyleMap = {
    ...linkStyleMap,
    stylename1: {
        color: "rgba(200,0,0,0.5)",
        borderRadius: "1000px",
        display: "inline-block",

        //   backgroundImage:`url(${url}/avatar/downloadavatar/aaa)`,
        //backgroundImage:`url(${url}/avatar/downloadavatar/${decoratedText.replace(" @","")})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",

    },

}



const initialState = {
    entityMap: {
        // "0": {
        //     type: "image",
        //     mutability: "IMMUTABLE",
        //     data: {
        //         src:
        //             "https://www.draft-js-plugins.com/images/canada-landscape-small.jpg"
        //     }
        // }
    },
    blocks: [
        {
            key: "1111",
            text: "",//`  @aaa @的就是dds http://asd.com `,//  \uD83D\uDE47\u200D\u2640\uFE0F   `,   //  \uD83D\uDE33`,
            type: "unstyled",
            depth: 0,
            inlineStyleRanges: [
                //    {
                //         offset: 4,
                //         length: 10,
                //         style: "HIGHLIGHT"
                //    },

            ],
            entityRanges: [],
            data: {}
        },


    ]
};


const panelMappingObj = { EmojiPluginPanel: <EmojiPluginPanel />, ImagePluginPanel: <ImagePluginPanel /> }

export const EditorContext = createContext();


const DraftEditor4 = () => {


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




    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(initialState)))

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
                            // style: {

                            //     lineHeight: "0px",
                            //     height: fontSize2 * 16 * 1.2 + "px",
                            //     display: "inline-flex",
                            //     alignItems: "center",
                            //     display: "inline",
                            //     backgroundColor: "#b7e1fc",
                            //     //    verticalAlign: "middle",
                            // }
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

    function renderHtml(contentToRent_ = preHtml || "Nothing to Render") {
        //   const contentToRent = toRent || preHtml

        let contentToRent = contentToRent_;

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

                    return <span
                        key={index}
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
                    }}>
                    inserBotomBlock  </Button>


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

                    customStyleMap={customStyleMap} //customStyleFn={customStyleFns}      

                    customStyleFn={function (item, block) {


                        // if(item.toObject().stylename1){

                        //     return {
                        //         ...item.toObject(),

                        //     }
                        // }


                        // if (block.getType() === "colorBlock") {
                        //     return { color: "#" + ((1 << 24) * Math.random() | 0).toString(16) }

                        // }
                        // console.log(item.toJS())
                        //  return {stylename1:{color:"green"}}



                    }}

                    blockRenderMap={Immutable.Map({
                        // 'header-two': {
                        //     element: 'h2'
                        // },
                        // 'unstyled': {
                        //     element: 'div'
                        // },
                        // 'italic': {
                        //     element: "i"
                        // },
                        // 'atomic': {
                        //     element: "figure",
                        // },
                        'codeBlock': {
                            element: "figure",
                        },
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


            <div style={{ whiteSpace: "pre-wrap", display: "flex", }}>
                {/* {JSON.stringify(editorState.getSelection(),null,2)} */}
                {/* {JSON.stringify(editorState.getCurrentContent().getLastCreatedEntityKey(), null, 2)} */}

                {/*   <div>{JSON.stringify(editorState.getCurrentContent(), null, 2)}</div>
                 <hr />
                 <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, 2)}</div> */}

                {/* {preHtml} */}
            </div>


        </EditorContext.Provider>
    )


}

export default DraftEditor4;





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



