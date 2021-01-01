
import React, { useContext, useRef, useEffect, useState, useMemo, } from 'react';
import styled, { ThemeProvider, css, keyframes, ThemeContext as ThemeStyledContext } from "styled-components";
import { Link } from 'react-router-dom';

import ImgTag from './ImgTag';

import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
//import { EditorContext } from './EditorContextProvider';
import { EditorContext } from './DraftEditor4';

import url from "./config";

import Button from "./Button";





export default function Uploader({ insertImageBlock, deleteImageBlock, ...props }) {

    const { userName, axios, picDataList, setPicDataList } = useContext(UserContext)

    const { showPlugin, toggleShow } = useContext(EditorContext)

    const isOn = showPlugin["ImagePluginPanel"]
    function setOn(...prop) { toggleShow("ImagePluginPanel",...prop) }
       


        const { color2 } = useContext(ThemeContext)
        const [pic, setPic] = useState()
        const [picList, setPicList] = useState({})

        const [uploadProgress, setUploadProgress] = useState("选取图片")

        const inputRef = useRef()

        function getPictureList() {
            if (!userName) { console.log("Please login first"); alert("please login first"); return null }


            return axios.get(`${url}/picture/getpictureid/${userName}`)
                .then(function ({ data }) {

                    setPicList(
                        function (pre) { return { ...data, ...pre } }
                    )

                })
                .catch(function (err) {
                    document.getElementById(`button_history`).disabled = false
                    console.log(err)
                })


        }



        function uploadPicture(pic) {
            if (!userName) { console.log("Please login first"); alert("please login first"); return null }

            const data = new FormData();
            data.append('file', pic);  // data.append('file', pic2);  //multi-uploading just append data

            data.append('obj',
                JSON.stringify({
                    filename: pic.name.trim(),
                    ownerName: userName,
                    uploadTime: Date.now(),

                })
            );
            setUploadProgress("0%")
            return axios.post(`${url}/picture/uploadpicture`, data, {
                headers: { 'content-type': 'multipart/form-data' },



                onUploadProgress: progressEvent => {

                    const percent = (progressEvent.loaded * 100 / progressEvent.total).toFixed(0) + "%"

                    percent === "100%"
                        ? setUploadProgress("gathering")
                        : setUploadProgress(percent)

                },
            })
        }


        useEffect(function () {

            pic && uploadPicture(pic).then(function (response) {

                setPicList(pre => { return { ...pre, [response.data[0]]: response.data[1] } })

                setPicDataList(pre => { return { ...pre, [response.data[1]]: URL.createObjectURL(pic) } })

                insertImageBlock(`${url}/picture/downloadpicture/${response.data[1]}`, response.data[1], URL.createObjectURL(pic))

                setPic(null)
                setUploadProgress("选取图片")

            }).catch(function (err) { setUploadProgress("选取图片"); console.log(err) })

        }, [pic])

        return (
            <>


                <div style={{
                    display: isOn ? "flex" : "none",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    // position:"fixed",
                    // left:0,
                    // top:0,
                    // zIndex:10,
                }}>

                    <div style={{
                        // marginTop:"10px",
                        display: "flex", 
                     //   backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),//color2,
                        backgroundColor: color2,
                        width: "100%",
                        alignItems: "flex-end", flexDirection: "row-reverse", flexWrap: "wrap",
                        justifyContent: "space-around",
                        position: "relative",

                        // boxShadow: `0px 0px 2px #5f5f5f,

                        // 0px 0px 0px 0px #ecf0f3,

                        // 8px -7px 15px #a7aaaf,

                        // -8px -8px 15px #ffffff`,


                    }} >
                        {isOn && <Button
                            style={{ display: "block", position: "absolute", top: 0, right: 0 }}
                            onClick={function () { setOn(false) }}>[ X ]</Button>}




                        {Object.keys(picList).map(function (item, index) {

                            return (
                                <ImageUnit key={item} item={item} picList={picList} insertImageBlock={insertImageBlock}
                                    deleteImageBlock={deleteImageBlock} setPicList={setPicList} />
                            )

                        })}




                        <div style={{
                            textAlign: "center",
                            width: "100%",
                        }}>
                            <input type="file" style={{ display: "none" }} ref={inputRef}
                                onClick={function (e) {
                                    e.currentTarget.value = null;
                                }}

                                onChange={function (e) {
                                    // alert((e.currentTarget.files[0].name).trim());
                                    e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)
                                        ? setPic(e.currentTarget.files[0])
                                        : setPic(null);
                                }}
                            />

                            <Button
                                style={{ marginTop: "10px", marginBottom: "10px", marginRight: "10px" }}
                                onClick={function (e) { setPic(null); inputRef.current.click() }}
                                disabled={pic ? true : false}
                            >
                                {uploadProgress}
                            </Button>

                            <Button
                                id="button_history"
                                style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "10px" }}
                                onClick={function (e) {

                                    e.target.disabled = true
                                    getPictureList()
                                }}
                            >
                                之前图片
                        </Button>

                        </div>

                    </div>

                </div>




            </>

        );
    }





    function ImageUnit({ item, picList, insertImageBlock, deleteImageBlock, setPicList, ...props }) {

        const { axios, picDataList, setPicDataList } = useContext(UserContext)




        const [progress, setProgress] = useState("加载")

        function downloadPicture(item, callback = function () { }) {


            if (document.getElementById(`button_load_${item}`).disabled === true) {
                alert(`yes, id = ${item} is in processing...`)
                return
            }

            const imgUrl = `${url}/picture/downloadpicture/${picList[item]}`
            const imgId = picList[item]




            document.getElementById(`button_delete_${item}`).disabled = true
            document.getElementById(`button_load_${item}`).disabled = true

            if (!picDataList[picList[item]]) {

                setProgress("0%")
                axios.get(imgUrl, {
                    responseType: 'arraybuffer',
                    onDownloadProgress: function (progressEvent) {

                        setProgress((progressEvent.loaded * 100 / progressEvent.total).toFixed(0) + "%")
                    },
                })
                    .then((response) => {



                        const base64 = btoa(
                            new Uint8Array(response.data).reduce(
                                (data, byte) => data + String.fromCharCode(byte),
                                '',
                            ),
                        );



                        setPicDataList(
                            function (pre) {
                                return {
                                    ...pre,
                                    [imgId]: "data:" + response.headers["content-type"] + ";base64," + base64,
                                }
                            }
                        )

                        callback(imgUrl, imgId, "data:" + response.headers["content-type"] + ";base64," + base64)

                        document.getElementById(`button_delete_${item}`).disabled = false
                        document.getElementById(`button_load_${item}`).disabled = false



                    })
                    .catch(err => {
                        document.getElementById(`button_delete_${item}`).disabled = false
                        document.getElementById(`button_load_${item}`).disabled = false

                        console.log(err)
                    })
            }
            else {

                callback(imgUrl, imgId, picDataList[picList[item]])

                document.getElementById(`button_delete_${item}`).disabled = false
                document.getElementById(`button_load_${item}`).disabled = false

            }

        }

        return (
            <>
                <span key={item} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <ImgTag

                        id={item}
                        isIcon={true}
                        style={{ display: "block" }}
                        // style={{ width: "100px", height: "auto" }}
                        onClick={function (e) {


                            downloadPicture(item, insertImageBlock)
                        }}
                    />
                    <div>
                        <Button
                            id={`button_delete_${item}`}
                            onClick={function (e) {


                                document.getElementById(`button_load_${item}`).disabled = true
                                document.getElementById(`button_delete_${item}`).disabled = true


                                axios.get(`${url}/picture/deleteiconpicture/${item}/${picList[item]}`)
                                    .then(function () {

                                        document.getElementById(`button_load_${item}`).style.display = false
                                        document.getElementById(`button_delete_${item}`).style.display = false


                                        const iconid = item
                                        const picid = picList[item]
                                        deleteImageBlock(picList[item])


                                        setPicList(
                                            pre => {
                                                const obj = pre;
                                                deleteFromObject(iconid, obj)
                                                return { ...obj }
                                            })
                                        setPicDataList(
                                            pre => {
                                                const obj = pre;
                                                deleteFromObject(picid, obj)
                                                return { ...obj }
                                            }
                                        )



                                    }).catch(function (err) {
                                        console.log(err)
                                        document.getElementById(`button_load_${item}`).disabled = false
                                        document.getElementById(`button_delete_${item}`).disabled = false
                                    })
                            }}

                        >删除</Button>

                        <Button

                            id={`button_load_${item}`}
                            style={{ display: picDataList.hasOwnProperty(picList[item]) ? "none" : "inline" }}
                            onClick={function (e) {

                                downloadPicture(item)

                            }}
                        >{progress}</Button>
                    </div>
                </span>
            </>
        )
    }
















    function deleteFromObject(keyPart, obj) {
        for (var k in obj) {          // Loop through the object
            if (~k.indexOf(keyPart)) { // If the current key contains the string we're looking for
                delete obj[k];       // Delete obj[key];
            }
        }
    }