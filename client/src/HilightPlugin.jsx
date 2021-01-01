
import React, { useState, useRef, useEffect } from 'react';
import { EditorState, KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';




export const hilightStyleMap = {

    HIGHLIGHT: {
        backgroundColor: "#fffe0d"
    },

    MARK: {
        backgroundImage: "url('https://mernchen.herokuapp.com/api/picture/download/5f74060dd85d4e001702af08')",
        backgroundColor: "wheat",
        minWidth: "2rem",
        maxHeight: "2rem",
        fontSize: "2rem",
        backgroundRepeat: "repeat-x",
        display: "inline-block",
        backgroundPosition: "left center",
        backgroundSize: "contain",
        overflow: "hidden",
        color: "rgba(120,211,32,0.5)",
        textAlign: "center",
    },

}



export default function createHilightPlugin(setEditorState) {
    return {


        //      keyBindingFn: function (e) { if (e.ctrlKey && e.keyCode === 72) { return "highlight"; } },

        keyBindingFn: function (e) {
            if (KeyBindingUtil.hasCommandModifier(e) && e.which === 72) {
                return "highlight";
            }
        },


        handleKeyCommand: function (command, editorState, timeStamp) {



            if (command === "highlight") {


                this.hiLightOperation(editorState)

            }
            return true;
        },
        hiLightOperation: function (editorState, isFromKey = true) {


            const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()
            const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
                = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]

            let newState = RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT")

            let newSelection = newState.getSelection().merge({
                anchorKey: anchorFocusKey,
                anchorOffset: anchorFocusOffset,
                focusKey: anchorFocusKey,
                focusOffset: anchorFocusKey,
                isBackward: false,
                hasFocus: true,

            })
            newState = EditorState.acceptSelection(newState, newSelection)
           

            setEditorState(newState);
            //return newState

        },


    };
}


