import React, { useState, useRef, useEffect } from 'react';
//import { EditorState, ContentBlock,KeyBindingUtil, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, SelectionState, CharacterMetadata } from 'draft-js';


import { EditorState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';



import Immutable from 'immutable'
import Button from './Button';
import Uploader from './Uploader';

function genKey(length = 4) {

    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}





export default function createImagePlugin() {


    let externalES = null;
    let externalSetEditorState = null;


    function insertImageBlock(url, id, imgdata) {


        const selection = externalES.getSelection();
        let contentState = externalES.getCurrentContent();

        const currentBlock = contentState.getBlockForKey(selection.getEndKey());
        const blockMap = contentState.getBlockMap()

        const blocksBefore = blockMap.toSeq().takeUntil(function (v) { return v === currentBlock })
        const blocksAfter = blockMap.toSeq().skipUntil(function (v) { return v === currentBlock }).rest()


        const newBlockKey = id + genKey()

        const newBlockKey2 = id + genKey()




        let newBlocks =
            [
                [currentBlock.getKey(), currentBlock],
                [newBlockKey, new ContentBlock({
                    key: newBlockKey,
                    type: "imageBlock",
                    text: '',
                    data: Immutable.fromJS({ imgUrl: url, imgId: id, imgData: imgdata }),
                })],
                [newBlockKey2, new ContentBlock({
                    key: newBlockKey2,
                    type: "unstyled",
                    text: '',
                    //  data: Immutable.fromJS({ imgUrl: url, imgId: id, imgData: imgdata }),

                })],
            ];
        const newBlockMap = blocksBefore.concat(newBlocks, blocksAfter).toOrderedMap()
        contentState = contentState.merge({
            blockMap: newBlockMap,
            selectionBefore: selection,//.merge({ hasFocus: true,}),
            selectionAfter: selection.merge({
                anchorKey: newBlockKey2,
                anchorOffset: 0,
                focusKey: newBlockKey2,
                focusOffset: 0,
                isBackward: false,
                hasFocus: true,
            }),
        })


        externalES = EditorState.push(externalES, contentState, 'insert-fragment');
        externalSetEditorState(externalES)


    };

    function deleteImageBlock(id) {

        const selection = externalES.getSelection();
        let contentState = externalES.getCurrentContent();

        const blockMap = contentState.getBlockMap()
        const newBlockMap = blockMap.toSeq().filter(function (block) {

            if (block.getType() === "imageBlock" && block.getKey().indexOf(id) >= 0) {
                return false
            }
            else if (
                block.getType() === "unstyled"
                && block.getKey().indexOf(id) >= 0
                && block.getText().length === 0
                && selection.getFocusKey() !== block.getKey()
            ) {
                return false
            }
            else {
                return true
            }



        }).toOrderedMap()



        contentState = contentState.merge({
            blockMap: newBlockMap,
            selectionBefore: selection,
            selectionAfter: selection,
        })


        externalES = EditorState.push(externalES, contentState, 'remove-fragment');
        externalSetEditorState(externalES)

    }



    function ImagePluginPanel() {


        return (
            <>
                <Uploader insertImageBlock={insertImageBlock} deleteImageBlock={deleteImageBlock} />
            </>

        )




    };


    return {

        ImagePluginPanel,
        imagePlugin: {

            onChange(editorState, { setEditorState }) {

                externalES = editorState
                externalSetEditorState = setEditorState

                return externalES
            },
        }


    }

};





///////////////////////////////////////////////////////////////////////////////////////////////////////////



