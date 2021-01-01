import React, { useState, useRef, useEffect, useContext } from 'react';

import { UserContext } from './contexts/UserContextProvider';
import url from "./config";

//import { usePicDataList } from './Uploader';

import { update } from 'immutable';

import axios from './contexts/axios';


export default function ImgTag({ id, isIcon = false, ...props }) {

    const { userName, axios, picDataList, setPicDataList } = useContext(UserContext)


    const [src, setSrc] = useState()
    useEffect(function () {
        if (picDataList[id]) { setSrc(picDataList[id]) }
        else {
            axios.get(isIcon ? `${url}/picture/downloadiconpicture/${id}` : `${url}/picture/downloadpicture/${id}`,
                { responseType: 'arraybuffer', }
            ).then(function (response) {

                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );
                setSrc("data:" + response.headers["content-type"] + ";base64," + base64)


                setPicDataList(
                    pre => {
                        const obj = { ...pre, [id]:"data:" + response.headers["content-type"] + ";base64," + base64 }
                        return obj
                    }
                )


            })
                .catch(err => { console.log(err.response) })
        }



    }, [id])

    return (
        <img src={src} id={id}  {...props} 
        
       
        
        
        
        />
    );
}

