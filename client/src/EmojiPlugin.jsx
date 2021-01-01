
import React, { useContext, useState, useRef, useEffect } from 'react';
import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';
import { ThemeContext } from './contexts/ThemeContextProvider';
//import { EditorContext } from './EditorContextProvider';
import { EditorContext } from './DraftEditor4';
import Button from './Button';

import {
    isMobile,
    isChrome,
    isFirefox,
} from "react-device-detect";



import url from './config';

import { useMediaQuery } from 'react-responsive';


function genKey(length = 4) {

    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}




export default function createEmojiPlugin() {

    let externalES = null;
    let externalSetEditorState = null;

    let emojiArr = [


        '\u2620',
        '\u2764',
        '\uD83D\uDC69\u200D\u2764\uFE0F\u200D\uD83D\uDC8B\u200D\uD83D\uDC69',
        '\uD83D\uDC7F',
        '\uD83D\uDC80',
        '\uD83D\uDCA9',
        '\uD83D\uDE01',
        '\uD83D\uDE02',
        '\uD83D\uDE03',
        '\uD83D\uDE04',
        '\uD83D\uDE05',
        '\uD83D\uDE06',
        '\uD83D\uDE07',
        '\uD83D\uDE08',
        '\uD83D\uDE09',
        '\uD83D\uDE0A',
        '\uD83D\uDE0B',
        '\uD83D\uDE0C',
        '\uD83D\uDE0D',
        '\uD83D\uDE0E',
        '\uD83D\uDE0F',
        '\uD83D\uDE10',
        '\uD83D\uDE12',
        '\uD83D\uDE13',
        '\uD83D\uDE14',
        '\uD83D\uDE16',
        '\uD83D\uDE18',
        '\uD83D\uDE1A',
        '\uD83D\uDE1C',
        '\uD83D\uDE1D',
        '\uD83D\uDE1E',
        '\uD83D\uDE20',
        '\uD83D\uDE21',
        '\uD83D\uDE22',
        '\uD83D\uDE23',
        '\uD83D\uDE24',
        '\uD83D\uDE25',
        '\uD83D\uDE28',
        '\uD83D\uDE29',
        '\uD83D\uDE2A',
        '\uD83D\uDE2B',
        '\uD83D\uDE2D',
        '\uD83D\uDE30',
        '\uD83D\uDE31',
        '\uD83D\uDE32',
        '\uD83D\uDE33',
        '\uD83D\uDE35',
        '\uD83D\uDE36',
        '\uD83D\uDE37',
        '\uD83D\uDE47\u200D\u2640\uFE0F',
        '\uD83E\uDD24',
        '\uD83E\uDD71'
    ]

    const emojiUrl = `url(${url}/emoji/downloademoji/`
    let emoji = {}

    emojiArr.forEach(icon => {

        emoji[icon] = emojiUrl + icon + ".png"
    })



    function findWithRegex(regex, contentBlock, callback) {
        const text = contentBlock.getText();
        let matchArr, start;
        while ((matchArr = regex.exec(text)) !== null) {
            start = matchArr.index;
            callback(start, start + matchArr[0].length);
        }
    }

    function emojiStrategy(contentBlock, callback, contentState) {

        //findWithRegex(/😃/g, contentBlock, callback)

        // Object.keys(emoji).forEach(function (key) {
        //     const regx = new RegExp(`${key}`, "g")
        //     findWithRegex(regx, contentBlock, callback)
        // })

        contentBlock.findEntityRanges(
            function (character) {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null &&
                    contentState.getEntity(entityKey).getType() === "EMOJI"

                );
            },
            callback
        );
    };

  
    function Emoji(props) {
        const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText } = props;
  
        const { fontSize2 } = useContext(ThemeContext)
        const isComputer = !useMediaQuery({ query: '(hover: none)' });

        const iconRef = useRef()


    

        if (isComputer) {
            return (
                <>
                    <span

                        ref={iconRef}
                        className="emoji"
                        style={{
                        

                            backgroundRepeat: "no-repeat",
                   
                            backgroundPosition: "center center",
                            backgroundSize: "contain",
                            display: "inline-block",
                         
                            textAlign: "right",
                            verticalAlign: "middle",


                            backgroundImage: isFirefox ? null : emoji[decoratedText],

                            height: fontSize2 * 16 + "px",
                            minWidth: fontSize2 * 16 + "px",
                            lineHeight: fontSize2 + "rem",
              
                        }}
                    >
                        <span style={{
                            clipPath: isFirefox ? null : "circle(0% at 50% 50%)",
                        }}>
                            {props.children}

                        </span>
                    </span>

                </>

            );
        }
        else {
            return (

                <span className="emoji_phone" >
                    {props.children}
                </span>
            )

        }
    };

    function taggingEmoji() {

        const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
        const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
            = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]


        const oldSelection = externalES.getSelection();
        let newContent = externalES.getCurrentContent();
        let newSelection = externalES.getSelection();




        externalES.getCurrentContent().getBlocksAsArray().forEach(function (block) {
            const blockKey = block.getKey();
            const blockType = block.getType();
            const blockText = block.getText();


            const metaArr = block.getCharacterList();
            metaArr.forEach(function (item, index) {

                if (item.getEntity()) {
                    const entityType = newContent.getEntity(item.getEntity()).getType()
                    if (entityType === "EMOJI") {

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






            Object.keys(emoji).forEach(function (emojiKey) {

                const regx = new RegExp(`${emojiKey}`, "g")
                // const array = [...blockText.matchAll(regx)].map(a => a.index);
                const array = []
                let matchArr;
                while ((matchArr = regx.exec(blockText)) !== null) {

                    const start = matchArr.index;
                    const end = matchArr.index + matchArr[0].length;

                    array.push(start)
                }


                array.forEach(function (offset) {

                    newContent = newContent.createEntity("EMOJI", "IMMUTABLE", { url: emoji[emojiKey] });
                    const entityKey = newContent.getLastCreatedEntityKey();

                    newSelection = externalES.getSelection().merge({
                        anchorKey: blockKey,
                        anchorOffset: offset,
                        focusKey: blockKey,
                        focusOffset: offset + emojiKey.length,
                        isBackward: false,
                        hasFocus: false,

                    })
                    newContent = Modifier.applyEntity(newContent, newSelection, entityKey)

                })

            })

        })
        externalES = EditorState.push(externalES, newContent, "insert-characters");
        externalES = EditorState.acceptSelection(externalES, oldSelection);
        return externalES
    }

    function insertEmoji(text) {

        const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray()
        const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
            = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]


        let newContent = Modifier.replaceText(
            externalES.getCurrentContent(),
            externalES.getSelection(),
            text,
        )

        let newSelection = externalES.getSelection().merge({

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

    function getEmoji(index) {
        return Object.keys(emoji)[index % Object.keys(emoji).length]
    }

    function getEmojiAll() {

        let icons = "";
        Object.keys(emoji).forEach(function (icon) {
            icons = icons + icon
        })
        return icons
    }

    function EmojiPluginPanel() {


        const { showPlugin, toggleShow } = useContext(EditorContext)
        const { fontSize1, fontSize2,color2 } = useContext(ThemeContext)

        const isOn = showPlugin["EmojiPluginPanel"]
      

        return (
            <>
                <div style={{
                    display: isOn ? "block" : "none",
                    //   backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    backgroundColor: color2,

                    width: "100%",
                }}>
                    <button style={{float:"right",fontSize:fontSize1+"rem"}}
                    
                    onClick={function(e){
                        toggleShow("EmojiPluginPanel",false)
                    }}
                    >[ X ]</button>
                       
                


                    {
                        Object.keys(emoji).map(function (icon, index) {
                            return (

                                <button
                                    key={index}
                                  
                                    onMouseEnter={
                                        function (e) {
                                            e.target.style.backgroundColor ="lightgray"
                                        }
                                    }
                                    onMouseOut={
                                        function (e) {
                                            e.target.style.backgroundColor = null
                                        }
                                    }
                                   onClick={
                                       function(e){
                                          // alert("dsd")
                                           insertEmoji(icon)
                                       }
                                   }

                                    style={{
                                        color: "rgba(0,0,0,0)",
                                        borderWidth: "1px",
                                        backgroundImage: emoji[icon],
                                        backgroundRepeat: "no-repeat",

                                        backgroundPosition: "center center",
                                        backgroundSize: "contain",
                                        fontSize: fontSize1 + "rem",

                                        minWidth: fontSize1 * 16 * 1.2 + "px",
                                    }}


                                >{icon}</button>
                            )

                        })
                    }







                </div>

            </>
        )
    }



    return {

        emojiPlugin: {
            keyBindingFn(e, { getEditorState }) {
                if (e.ctrlKey && e.shiftKey && e.keyCode === 76) {
                    return "add-emoji";
                }
            },

            handleKeyCommand(command, editorState, /*{ getEditorState, setEditorState2 }*/) {

                if (command !== "add-emoji") { return "un-handled" }

                if (command === "add-emoji") {
                    insertEmoji(getEmoji(0) + " @tomK大声道" + getEmoji(1));
                    return "emoji-adding-handled";
                }
            },

            onChange(editorState, { setEditorState }) {

                externalES = editorState
                externalSetEditorState = setEditorState
                externalES = taggingEmoji()

                return externalES
            },

            decorators: [
                {
                    strategy: emojiStrategy,
                    component: Emoji
                }
            ],

        },

        EmojiPluginPanel,
        insertEmoji,
        getEmoji,
        getEmojiAll,

    }

}



