
import React, { useContext, useRef, useEffect, useState } from 'react';
import styled, { ThemeProvider, css, keyframes, ThemeContext as ThemeStyledContext } from "styled-components";
import { Link } from 'react-router-dom';

import ImgTag from './ImgTag';

import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import url from "./config";

import Button from "./Button";



export default function Uploader({ insertImageBlock, deleteImageBlock, ...props }) {

    const { userState, axios, picDataList, setPicDataList } = useContext(UserContext)
    const [pic, setPic] = useState()
    const [picList, setPicList] = useState({})
    // const [picDataList, setPicDataList] = useState({})

    const [isOn, setOn] = useState(true)

    const inputRef = useRef()




    function uploadPicture(pic) {
        if (!userState) { console.log("Please login first"); alert("please login first"); return null }

        const data = new FormData();
        data.append('file', pic);
        // data.append('file', pic2);  //multi-uploading just append data
        data.append('obj',
            JSON.stringify({
                filename: pic.name.trim(),
                ownerName: userState.userName,
                uploadTime: Date.now(),

            })
        );





        return axios.post(`${url}/picture/uploadpicture`, data, {
            headers: { 'content-type': 'multipart/form-data' },


            //   responseType: 'arraybuffer',
            onUploadProgress: progressEvent => {
                let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                console.log("Uploading backPicture --- " + percentCompleted);

                //percentCompleted === 100 &&   alert("upload backPicture done")
                //  setProgress(percentCompleted+"%");
                //  percentCompleted === 100
                //     ? setPercentage("Finished")
                //    : setPercentage(percentCompleted + "%")
            },
        }).then((response) => {

            return response
            // downloadBackPicture()

        })
    }

    function getPictureList() {
        if (!userState) { console.log("Please login first"); alert("please login first"); return null }


        return axios.get(`${url}/picture/getpictureid/${userState.userName}`)
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

    useEffect(function () {

        pic && uploadPicture(pic).then(function (response) {

            setPicList(pre => { return { ...pre, [response.data[0]]: response.data[1] } })

            setPicDataList(pre => { return { ...pre, [response.data[1]]: URL.createObjectURL(pic) } })

            insertImageBlock(`${url}/picture/downloadpicture/${response.data[1]}`, response.data[1], URL.createObjectURL(pic))
            setPic(null)

        }).catch(function (err) { console.log(err) })

    }, [pic])

    return (
        <>

            <Button
                onClick={function () {
                    setOn(pre => !pre)
                    //  Object.keys(picList).length === 0 && getPictureList()
                }}

            >test</Button>


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
                    display: "flex", backgroundColor: "wheat", justifyContent: "center",
                    alignItems: "flex-end", flexDirection: "row-reverse", flexWrap: "wrap"
                }} >
                    {Object.keys(picList).reverse().map(function (item, index) {



                        return (
                            <span key={item} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                <ImgTag

                                    id={item}
                                    isIcon={true}
                                    style={{ display: "block" }}
                                    // style={{ width: "100px", height: "auto" }}
                                    onClick={function (e) {

                                        if (document.getElementById(`button_load_${item}`).disabled === true) {

                                            alert(`yes, id = ${item} is in processing...`)
                                            return
                                        }

                                        const imgUrl = `${url}/picture/downloadpicture/${picList[item]}`
                                        const imgId = picList[item]




                                        document.getElementById(`button_delete_${item}`).disabled = true
                                        document.getElementById(`button_load_${item}`).disabled = true

                                        if (!picDataList[picList[item]]) {

                                            //     console.log("not have")
                                            axios.get(imgUrl, { responseType: 'arraybuffer' })
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

                                                    insertImageBlock(imgUrl, imgId, "data:" + response.headers["content-type"] + ";base64," + base64)

                                                    document.getElementById(`button_delete_${item}`).disabled = false
                                                    document.getElementById(`button_load_${item}`).disabled = false



                                                })
                                                .catch(err => {
                                                    console.log(err)
                                                })
                                        }
                                        else {

                                            insertImageBlock(imgUrl, imgId, picDataList[picList[item]])

                                            document.getElementById(`button_delete_${item}`).disabled = false
                                            document.getElementById(`button_load_${item}`).disabled = false

                                        }

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
                                                    //      document.getElementById(`${item}`).style.display = "none"



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

                                    >delete</Button>

                                    <Button

                                        id={`button_load_${item}`}
                                        style={{ display: picDataList.hasOwnProperty(picList[item]) ? "none" : "inline" }}
                                        onClick={function (e) {

                                            document.getElementById(`button_load_${item}`).disabled = true
                                            document.getElementById(`button_delete_${item}`).disabled = true



                                            const imgUrl = `${url}/picture/downloadpicture/${picList[item]}`

                                            axios.get(imgUrl, { responseType: 'arraybuffer' })
                                                .then((response) => {


                                                    document.getElementById(`button_load_${item}`).disabled = false
                                                    document.getElementById(`button_delete_${item}`).disabled = false

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
                                                                [picList[item]]: "data:" + response.headers["content-type"] + ";base64," + base64,
                                                            }


                                                        }
                                                    )
                                                })
                                                .catch(err => {
                                                    document.getElementById(`button_load_${item}`).disabled = false
                                                    document.getElementById(`button_delete_${item}`).disabled = false

                                                    console.log(err)
                                                })

                                        }}
                                    >Load</Button>
                                </div>

                            </span>)

                    })}
                </div>

                <div>
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
                        style={{ marginBottom: "10px" }}
                        onClick={function (e) { setPic(null); inputRef.current.click() }}
                        disabled={pic ? true : false}
                    >
                        Pick a image
                    </Button>

                    <Button
                        id="button_history"
                        onClick={function (e) {

                            e.target.disabled = true
                            getPictureList()
                        }}

                    >
                        History image
                    </Button>


                </div>

            </div>
        </>

    );
}

function deleteFromObject(keyPart, obj) {
    for (var k in obj) {          // Loop through the object
        if (~k.indexOf(keyPart)) { // If the current key contains the string we're looking for
            delete obj[k];       // Delete obj[key];
        }
    }
}