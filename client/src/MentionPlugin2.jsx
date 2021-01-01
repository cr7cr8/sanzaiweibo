import React, { useState, useEffect, useContext, useRef } from "react";
import { RichUtils, Modifier, KeyBindingUtil, EditorState, CompositeDecorator } from "draft-js";

import styled, { ThemeProvider, css, keyframes } from "styled-components";
import Avartar, { AvartarSmall } from "./Avatar";
import Avartar2, { Avatar4 } from "./Avatar2";

import { ThemeContext } from './contexts/ThemeContextProvider';

import url from './config.js';

import cpath from './Images/clippath.svg';
import {
    isMobile,
    isFirefox,
    isChrome,
    browserName,
    engineName,
} from "react-device-detect";



export default function createMentionPlugin() {
    let externalES = null;
    let friendsList = null;
    let externalSetEditorState = null;
    let tabIndex = -123;



    function Mention(props) {
        const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, } = props;


        const { person, imgurl, mentionType } = contentState.getEntity(entityKey).getData()




        return (
            <MentionComponent {...{
                inputFriendName,
                friendsList,
                decoratedText,

                entityKey,
                person,
                imgurl,
                mentionType,
                ...props
            }}
            />
        )

    }


    function MentionComponent(props) {

        const { mentionHeadKey, mentionBodyKey, person, imgurl, mentionType, children, friendsList, entityKey } = props;
        const { fontSize2 } = useContext(ThemeContext)





        if ((mentionType === "MentionOnAt")) {

            return <span style={{
                display: "inline",
                backgroundColor: "wheat",
                verticalAlign: "middle",
                position: "relative",
            }}>
                <div style={{
                    lineHeight: "0px",
                    height: fontSize2 * 16 * 1.2 + "px",
                    minWidth: fontSize2 * 16 * 1.2 + "px",
                    display: "inline-block",

                }}>
                    {children}
                </div>
            </span>

        }
        else if ((mentionType === "MentionOnOther")) {

            return <span style={{
                lineHeight: "0px",
                borderTopLeftRadius: "1000px", borderBottomLeftRadius: "1000px",
                height: fontSize2 * 16 * 1.2 + "px",
                minWidth: fontSize2 * 16 * 1.2 + "px",
                display: "inline-flex",
                alignItems: "center",

                backgroundColor: "#FAA",
                verticalAlign: "middle",

                position: "relative",
                overflow: "hidden"

            }}>
                {/* <div style={{ display: "inline-block", }}> */}

                {children}
                {/* </div> */}



            </span>



            // return <span style={{
            //     display: "inline",
            //     backgroundColor: "#faa",
            //     verticalAlign: "middle",
            //     position: "relative",
            // }}>
            //     <div style={{
            //         lineHeight: "0px",
            //         height: fontSize2 * 16 * 1.2 + "px",
            //         minWidth: fontSize2 * 16 * 1.2 + "px",
            //         display: "inline-block",

            //     }}>
            //         {children}
            //     </div>
            // </span>
        }
        else if ((mentionType === "MentionOff")) {

            return <span style={{
                lineHeight: "0px",
                borderTopLeftRadius: "1000px", borderBottomLeftRadius: "1000px",
                height: fontSize2 * 16 * 1.2 + "px",
                minWidth: fontSize2 * 16 * 1.2 + "px",
                display: "inline-flex",
                alignItems: "center",

                backgroundColor: "#b7e1fc",
                verticalAlign: "middle",

                position: "relative",
                overflow: "hidden"

            }}>
                <div style={{ display: "inline-block", }}>

                    {children}
                </div>
                {person.length >= 3 && <img
                    height={fontSize2 * 16 * 1.2 + "px"}
                    width={fontSize2 * 16 * 1.2 + + "px"}
                    src={imgurl.replace("url(", "").replace(")", "")}
                    style={{
                        position: "absolute",
                        left: isMobile && isFirefox ? fontSize2 * 16 * 0.3 : 0,
                        top: 0,
                        borderRadius: isMobile && isFirefox ? null : "1000px",
                        boxShadow: "rgb(180, 180, 180) -2px 0px 3px",
                        //    opacity:0.5,
                    }}
                    onClick={function (e) {
                        e.preventDefault()
                        e.target.style.display = "none"
                        //e.target.style.opacity = 0
                    }}
                />}


            </span>




        }

    }


    function taggingMention() {

        const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
        const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
            = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]


        const oldSelection = externalES.getSelection();
        let newSelection = externalES.getSelection();

        let newContent = externalES.getCurrentContent();




        externalES.getCurrentContent().getBlocksAsArray().forEach(function (block) {
            const blockKey = block.getKey();
            const blockType = block.getType();
            const blockText = block.getText();

            const regx = /\s([@][\w_\[\u4E00-\u9FCA\]]*)/g
            //  const regx = /\s([@#][\w_]*)/g
            //   const array = [...blockText.matchAll(regx)].map(a => a.index);


            const metaArr = block.getCharacterList();
            metaArr.forEach(function (item, index) {
                if (item.getEntity()) {
                    const entityType = newContent.getEntity(item.getEntity()).getType()

                    if ((entityType.indexOf("Mention") >= 0)) {

                        newSelection = externalES.getSelection().merge({
                            anchorKey: blockKey,
                            anchorOffset: index,
                            focusKey: blockKey,
                            focusOffset: index + 1,
                            isBackward: false,
                            hasFocus: false,
                        })
                        newContent = Modifier.applyEntity(newContent, newSelection, null)
                    }
                }
            })



            let matchArr;
            while ((matchArr = regx.exec(blockText)) !== null) {


                const start = matchArr.index;
                const end = matchArr.index + matchArr[0].length;
                const contentLenth = end - start;
                const contentFocusAt = anchorFocusOffset - start;
                const tagText = blockText.substring(start, end);


                const mentionOnAt = hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt === 2)

                const mentionOnOther = hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt !== 2) && (contentFocusAt >= 1) && (contentFocusAt <= contentLenth)

                const mentionOff = (!hasfocus) || (blockKey !== anchorFocusKey) || (contentFocusAt <= 0) || (contentFocusAt > contentLenth)


                if (mentionOnAt) {
                    //      alert("MentionOnAt")
                    createSimpleTag("MentionOnAt")
                }
                else if (mentionOnOther) {
                    //     alert("MentionOnOther")
                    createSimpleTag("MentionOnOther")
                }
                else if (mentionOff) {
                    //    alert("MentionOff")
                    createSimpleTag("MentionOff")
                }




                function createSimpleTag(tagName) {
                    newContent = newContent.createEntity(tagName, "MUTABLE", { mentionType: tagName });

                    let mentionKey = newContent.getLastCreatedEntityKey();
                    newSelection = newSelection.merge({
                        anchorKey: blockKey,
                        focusKey: blockKey,
                        anchorOffset: start,
                        focusOffset: end,
                        isBackward: false,
                        hasFocus: false,
                    })
                    newContent = Modifier.applyEntity(newContent, newSelection, mentionKey)
                    newContent = newContent.mergeEntityData(mentionKey,

                        {
                            mentionKey,
                            person: blockText.substring(start, end).replace(" @", ""),
                            imgurl: `url(${url}/avatar/downloadavatar/${blockText.substring(start, end).replace(" @", "")})`
                        }
                    )
                }


                function createTag(tagName, ) {

                    newContent = newContent.createEntity(`${tagName}_HEAD`, "MUTABLE", { mentionType: `${tagName}_HEAD` });
                    let mentionHeadKey = newContent.getLastCreatedEntityKey();
                    newSelection = newSelection.merge({
                        anchorKey: blockKey,
                        focusKey: blockKey,
                        anchorOffset: start,
                        focusOffset: start + 2,
                        isBackward: false,
                        hasFocus: false,
                    })

                    newContent = Modifier.applyEntity(newContent, newSelection, mentionHeadKey)

                    newContent = newContent.createEntity(`${tagName}_BODY`, "MUTABLE", { mentionType: `${tagName}_BODY` });
                    let mentionBodyKey = newContent.getLastCreatedEntityKey();
                    newSelection = newSelection.merge({
                        anchorKey: blockKey,
                        focusKey: blockKey,
                        anchorOffset: start + 2,
                        focusOffset: end,
                        isBackward: false,
                        hasFocus: false,
                    })

                    newContent = Modifier.applyEntity(newContent, newSelection, mentionBodyKey)


                    newContent = newContent.mergeEntityData(
                        mentionHeadKey,
                        {
                            mentionHeadKey, mentionBodyKey,
                            person: blockText.substring(start, end).replace(" @", ""),
                            imgurl: `url(${url}/avatar/downloadavatar/${blockText.substring(start, end).replace(" @", "")})`
                        }
                    )

                    newContent = newContent.mergeEntityData(
                        mentionBodyKey,
                        {
                            mentionHeadKey, mentionBodyKey,
                            person: blockText.substring(start, end).replace(" @", ""),
                            imgurl: `url(${url}/avatar/downloadavatar/${blockText.substring(start, end).replace(" @", "")})`
                        }
                    )
                }





            }
        })

        externalES = EditorState.push(externalES, newContent, "insert-fragment");
        externalES = EditorState.acceptSelection(externalES, oldSelection);
        //externalES = EditorState.forceSelection(externalES, oldSelection);
        return externalES

    }

    function inputFriendName(friendName, mentionHeadKey, mentionBodyKey, entityKey) {


        const text = friendName + " "
        const contentState = externalES.getCurrentContent();
        const selection = externalES.getSelection();


        const mentionBodyText = mentionBodyKey
            ? contentState.getEntity(mentionBodyKey).getData().person.replace(" @", "")
            : ""

        const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = selection.toArray()
        const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
            = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]


        let newSelection = selection.merge({
            anchorKey: anchorStartKey,
            anchorOffset: anchorStartOffset,
            focusKey: anchorStartKey,
            focusOffset: anchorStartOffset + mentionBodyText.length,
            isBackward: false,
            hasFocus: true,

        })


        let newContent = Modifier.replaceText(
            contentState,
            newSelection,
            text,
        )

        newSelection = externalES.getSelection().merge({

            anchorKey: anchorStartKey,
            anchorOffset: anchorStartOffset + text.length,
            focusKey: anchorStartKey,
            focusOffset: anchorStartOffset + text.length,
            isBackward: false,
            hasFocus: true,
        })

        externalES = EditorState.push(externalES, newContent, "insert-characters");
        externalES = EditorState.acceptSelection(externalES, newSelection)

        externalSetEditorState(externalES)
    }


    function hasOnAtTag() {
        // /friendName, mentionHeadKey, mentionBodyKey, entityKey
        if (friendsList.length <= 0) { return false }

        let isAtOn = false;
        const contentState = externalES.getCurrentContent();
        contentState.getBlocksAsArray().forEach(function (block) {

            const metaArr = block.getCharacterList();
            metaArr.forEach(function (item, index) {

                const tagKey = item.getEntity()
                if (tagKey) {
                    const { mentionType, mentionHeadKey, mentionBodyKey } = contentState.getEntity(tagKey).getData()
                    if (mentionType) {

                        console.log(contentState.getEntity(tagKey).toObject())



                        if (mentionType === "shortMentionOn") {


                            return isAtOn = [friendsList[tabIndex % friendsList.length], "", "", tagKey]
                        }
                        else if (mentionType.indexOf("longMentionOnAt") >= 0) {

                            return isAtOn = [friendsList[tabIndex % friendsList.length], mentionHeadKey, mentionBodyKey, tagKey]
                        }
                    }
                }
            })

            if (isAtOn) { return isAtOn }
        })
        return isAtOn
    }


    function mentionStrategy(contentBlock, callback, contentState) {


        ///  findWithRegex(/\s([@#][\w_\[\u4E00-\u9FFF\]]*)/g, contentBlock, callback)

        contentBlock.findEntityRanges(
            function (character) {
                const entityKey = character.getEntity();

                return entityKey !== null && contentState.getEntity(entityKey).getType().indexOf("Mention") >= 0


            },
            callback
        );
    }

    return function (fl = []) {


        friendsList = fl;
        tabIndex = tabIndex === -123 ? 1000 * friendsList.length : tabIndex

        return {

            handleBeforeInput(chars, editorState, evenTimeStamp, { setEditorState }) {

                if ((isMobile && (!isFirefox))) {
                    externalES = editorState;
                    externalSetEditorState = setEditorState;



                    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
                    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
                        = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]

                    let newSelection = externalES.getSelection()
                    let newContent = externalES.getCurrentContent()


                    newSelection = newSelection.merge({

                        isBackward: false,
                        hasFocus: true,
                    })


                    newContent = Modifier.replaceText(
                        newContent,
                        newSelection,
                        chars,
                    )

                    newSelection = newSelection.merge({
                        // anchorOffset: anchorStartOffset ,//+ chars.length*2 ,
                        // focusOffset: anchorFocusOffset ,//+ chars.length*2 ,
                        // isBackward: false,
                        // hasFocus: true,
                    })


                    externalES = EditorState.push(externalES, newContent, "insert-characters");
                    externalES = EditorState.acceptSelection(externalES, newSelection)

                    setEditorState(externalES)
                    return "handled"
                }




            },



            keyBindingFn(e, { getEditorState }) {





                if ((e.keyCode === 40) && hasOnAtTag()) {
                    tabIndex = tabIndex + 1;

                    return "fire-arrow";
                }

                else if ((e.keyCode === 38) && hasOnAtTag()) {
                    tabIndex = tabIndex - 1;
                    return "fire-arrow";
                }

                else if ((e.keyCode === 13) && hasOnAtTag()) {

                    return "fire-enter";
                }


            },

            onChange(editorState, { setEditorState }) {

                externalES = editorState
                externalSetEditorState = setEditorState
                externalES = taggingMention()



                if (Array.isArray(hasOnAtTag())) {


                    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
                    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
                        = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]

                    console.log(hasfocus)
                }


                return externalES

            },

            handleKeyCommand(command, editorState, evenTimeStamp, { setEditorState }) {

                //   externalES = editorState;

                //     if ((command !== "fire-arrow") && (command !== "fire-enter")&& (command !== "ccc-ccc")) { return "un-handled" }

                if (command === "fire-arrow") {

                    externalSetEditorState(externalES)

                    return "handled"
                }

                if (command === "fire-enter") {

                    inputFriendName(...hasOnAtTag())

                    alert("ddd")
                    return "handled"
                }
                if (command === "ccc-ccc") {
                    alert("bug")
                    //inputFriendName(...hasOnAtTag())

                    // return null;
                    return 'un-handled';
                }

                //  return 'not-handled';
            },

            decorators: [
                {
                    strategy: mentionStrategy,
                    component: Mention
                }
            ],
        }
    }
};

