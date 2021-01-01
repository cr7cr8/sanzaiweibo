

import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Button from './Button';
import url from './config';

function EmojiUpload() {

    const [pic, setPic] = useState()


    const [uploadProgress, setUploadProgress] = useState("选取图片")

    const inputRef = useRef()



    function uploadPicture(pic) {
   
        const data = new FormData();
        data.append('file', pic);  // data.append('file', pic2);  //multi-uploading just append data

        data.append('obj',
            JSON.stringify({
                filename: pic.name.trim(),
                ownerName: pic.name.trim(),
                uploadTime: Date.now(),

            })
        );
        setUploadProgress("0%")
        return axios.post(`${url}/emoji/uploademoji`, data, {
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

       
            setPic(null)
            setUploadProgress("选取图片")

        }).catch(function (err) { setUploadProgress("选取图片"); console.log(err) })

    }, [pic])



    return (
        <>


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


            </div>






        </>


    );
}

export default EmojiUpload
