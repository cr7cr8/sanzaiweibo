import React, { useContext } from "react";
import { RichUtils, KeyBindingUtil, EditorState, CompositeDecorator, Modifier } from "draft-js";

import { ThemeContext } from './contexts/ThemeContextProvider';


export const linkStyleMap = {

    linkStyle: {
        color: "blue",
        textDecoration: "underline",

    },

}


export default function createLinkPlugin() {

    let externalES = null;
    let externalSetEditorState = null;


    function linkStrategy(contentBlock, callback, contentState) {


        ///  findWithRegex(/\s([@#][\w_\[\u4E00-\u9FFF\]]+)/g, contentBlock, callback)

        contentBlock.findEntityRanges(
            function (character) {
                const entityKey = character.getEntity();
                return (
                    entityKey !== null && (
                        contentState.getEntity(entityKey).getType() === "linkOn" ||
                        contentState.getEntity(entityKey).getType() === "linkOff"
                    )
                );
            },
            callback
        );
    }

    function Link(props) {
        const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText } = props;
        const { linkType, linkAddress, linkHost } = contentState.getEntity(entityKey).getData()

        return (
            <LinkComponent {...{
                linkAddress,
                linkType,
                linkHost,
                ...props
            }}

            />
        )
    }


    function LinkComponent(props) {
        const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, linkType, linkAddress, linkHost } = props;
        //  const { type, mutability, data: { link_address, link_length } } = contentState.getEntity(entityKey).toObject()
        const { fontSize2 } = useContext(ThemeContext)

        // console.log(type + " " + mutability + " " + link_address)
        // style={{ fontSize: Math.max(fontSize2 * 0.7, 1) + "rem" }}>

        if (linkType === "linkOn") {

            return (
                <>
                    <span href={linkAddress} style={{ backgroundColor: "#FAF", fontSize: Math.max(fontSize2 * 0.7, 0.7) + "rem" }}>
                        {props.children}
                    </span>


                </>
            )


        }
        else if (linkType === "linkOff") {
            return (
                <>
                    <span style={{
                        fontSize: Math.max(fontSize2 * 0.7, 0.7) + "rem",


                        color: "blue",
                        //  textDecoration: "underline",

                    }}>
                        <span style={{
                            width: "0px", height: "0px", display: "inline-block", overflow: "hidden", //clipPath:  "circle(0% at 2250% 2250%)",
                        }}>
                            {props.children}
                        </span>
                        {linkHost}
                    </span>
                </>


            )

        }


    }



    function taggingLink() {

        const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = externalES.getSelection().toArray();
        const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
            = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,];


        const oldSelection = externalES.getSelection();
        let newContent = externalES.getCurrentContent();
        let newSelection = externalES.getSelection();



        externalES.getCurrentContent().getBlocksAsArray().forEach(function (block) {
            const blockKey = block.getKey();
            const blockType = block.getType();
            const blockText = block.getText();


            //   const regx = /\s([a-zA-Z]{1,10}:\/\/)(([a-zA-Z0-9]+(\.[a-zA-Z0-9]+){0,5})(:\d{1,6})?)(\/[^\s\r\n\/]+){0,6}(\/)?/g

            // const regx = /\s([a-zA-Z]{1,10}:\/\/)((([a-zA-Z0-9]+(.?)){0,5})(:\d{0,6})?)(\/[^\s\r\n\/]+){0,7}(\/)?/g

            const regx = /\s([a-zA-Z]{1,10}:\/\/)(([a-zA-Z0-9-_]+\.?)+(:\d{0,6})?)(\/[^\s\r\n\/]+){0,7}(\/)?/g

            const metaArr = block.getCharacterList();
            metaArr.forEach(function (item, index) {

                if (item.getEntity()) {
                    const entityType = newContent.getEntity(item.getEntity()).getType()

                    if ((entityType === "linkOn") || (entityType === "linkOff")) {
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
                if (item.getStyle()) {
                    const styleArr = item.getStyle().toArray()
                    if (styleArr.includes("linkStyle")) {
                        newSelection = externalES.getSelection().merge({
                            anchorKey: blockKey,
                            anchorOffset: index,
                            focusKey: blockKey,
                            focusOffset: index + 1,
                            isBackward: false,
                            hasFocus: false,
                        })
                        newContent = Modifier.removeInlineStyle(newContent, newSelection, "linkStyle")
                    }
                }
            })

            let matchArr;
            while ((matchArr = regx.exec(blockText)) !== null) {

                const start = matchArr.index;
                const end = matchArr.index + matchArr[0].length
                const contentLenth = end - start;
                const contentFocusAt = anchorFocusOffset - start;
                const linkAddress = blockText.substring(start, end);
                const linkHost = " " + matchArr[2];


                const linkOn = hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt > 0) && (contentFocusAt <= contentLenth)
                const linkOff = ((!hasfocus) || (blockKey !== anchorFocusKey) || (contentFocusAt <= 0) || (contentFocusAt - contentLenth > 0))




                if (linkOn) {
                    newContent = newContent.createEntity("linkOn", "MUTABLE", { linkType: "linkOn", linkAddress, linkHost });
                    const entityKey = newContent.getLastCreatedEntityKey();
                    newSelection = externalES.getSelection().merge({
                        anchorKey: blockKey,
                        anchorOffset: start,   //[...blockText][start] === " " ? start + 1 : start,
                        focusKey: blockKey,
                        focusOffset: end,
                        isBackward: false,
                        hasFocus: false,
                    })
                    newContent = Modifier.applyEntity(newContent, newSelection, entityKey)
                }
                else if (linkOff) {
                    newContent = newContent.createEntity("linkOff", "MUTABLE", { linkType: "linkOff", linkAddress, linkHost });
                    const entityKey = newContent.getLastCreatedEntityKey();
                    newSelection = externalES.getSelection().merge({
                        anchorKey: blockKey,
                        anchorOffset: start,   //[...blockText][start] === " " ? start + 1 : start,
                        focusKey: blockKey,
                        focusOffset: end,
                        isBackward: false,
                        hasFocus: false,
                    })
                    newContent = Modifier.applyEntity(newContent, newSelection, entityKey)
                    //  newContent = Modifier.applyInlineStyle(newContent, newSelection, "linkStyle")
                }





            }
        });

        externalES = EditorState.push(externalES, newContent, "insert-fragment");
        externalES = EditorState.acceptSelection(externalES, oldSelection);
        return externalES;





    };





    return {
        keyBindingFn(event, { getEditorState, setEditorState }) {

        },


        handleKeyCommand(command, editorState, { getEditorState, setEditorState }) {
            return "un-handled"

        },

        onChange(editorState, { setEditorState }) {
            externalES = editorState;
            externalSetEditorState = setEditorState;
            externalES = taggingLink();
            return externalES
            //  return editorState 
        },




        decorators: [
            {
                strategy: linkStrategy,
                component: Link
            }
        ],
    }

};

