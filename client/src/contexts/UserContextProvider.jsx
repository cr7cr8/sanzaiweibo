import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect } from 'react';
import styled, { ThemeProvider, css } from "styled-components";
import axios from './axios';
import url from "../config";

import jwtDecode from 'jwt-decode';


import {
    isMobile,
    isFirefox,
    isChrome,
    browserName,
    engineName,
} from "react-device-detect";


import RegisterForm from '../RegisterForm';
import { connect } from 'mongoose';

export const UserContext = createContext();



const UserContextProvider = (props) => {



    const [userName, setUserName] = useState(
        localStorage.getItem("token")
            ? jwtDecode(localStorage.getItem("token")).userName
            : ""
    );

    const [friendsList, setFriendsList] = useState(userName?[userName]:[])
    function uploadFriendsList(friendsArr) {
        if (!userName) { console.log("Please login first"); alert("please login first"); return null }

        axios.post(`${url}/user/updatefriendslist`, friendsArr).then((response) => {
            console.log(response.data)

            console.log(contentList)

            console.log(friendsArr)
            setContentList(pre=>{
                const arr = pre.filter(function(content){
                    return friendsArr.includes(content.ownerName)
                })
                return arr
            })


        }).catch(err => { console.log(err) })
    }

    useMemo(downloadFriendsList, [userName])
    function downloadFriendsList() {
        if (!userName) { return null }
        axios.get(`${url}/user/getfriendslist`).then((response) => {

            setFriendsList([... new Set([...response.data,userName])])


        }).catch(err => { console.log(err) })

    }


   
    const [contentList, setContentList] = useState([])
    function uploadContentList(preHtml) {

        return userName && axios.post(`${url}/article`, {
            ownerName: userName,
            content: preHtml,
        }).then((response) => {

            setContentList(pre => {

                return [response.data, ...pre,]
            })
            return response
        })

    }
    
    useMemo(downloadContentList, [userName])
    function downloadContentList() {

        if (!userName) {
            return axios.get(`${url}/article/all2`).then((response) => {

                setContentList(pre => {

                    const arr = [...response.data].sort(function (item1, item2) {

                        if (item1._id > item2._id) { return -1 }
                        else if (item1._id < item2._id) { return 1 }
                        else { return 0 }
                    })

                    return arr
                })
                return response
            })
        }
        else {

            return axios.post(`${url}/article/all`, contentList.map(function (content) {
                return content._id
            })).then((response) => {

           //     console.log(response.data)

                setContentList(pre => {
                    if (response.data.length === 0) {
                        
                    (friendsList.length>1)&&alert("目前只有这些");
                    
                    return pre }

                    const arr = [...pre, ...response.data].sort(function (item1, item2) {

                        if (item1._id > item2._id) { return -1 }
                        else if (item1._id < item2._id) { return 1 }
                        else { return 0 }
                    })

                    console.log(arr)
                    return arr
                })
                return response
            })




            return axios.get(`${url}/article/all`).then((response) => {

                setContentList(pre => {

                    const arr = [...pre, ...response.data].sort(function (item1, item2) {

                        if (item1._id > item2._id) { return -1 }
                        else if (item1._id < item2._id) { return 1 }
                        else { return 0 }
                    })

                    console.log(arr)
                    return arr
                })
                return response
            })

        }
    }


    function deleteContentList(id) {
        return userName && axios.get(`${url}/article/delete/${id}`).then(function (response) {
            setContentList((pre) => {
                return pre.filter(poster => { return poster._id !== id })

            })
            return response
        })

    }

    const [contentNum, setContentNum] = useState(0)
    function countContentNum() {
        userName && axios.get(`${url}/article/count`).then(response => {

            setContentNum(Number(response.data))
        })


    }
    useMemo(countContentNum, [userName, friendsList,contentList])



    const [userBackPicture, setUserBackPicture] = useState();
    function uploadBackPicture(pic) {
        if (!userName) { console.log("Please login first"); alert("please login first"); return null }

        const data = new FormData();
        data.append('file', pic);

        data.append('obj',
            JSON.stringify({
                filename: pic.name.trim(),
                ownerName: userName,
                uploadTime: Date.now(),

            })
        );

        return axios.post(`${url}/backpicture/uploadbackpicture`, data, {
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

            // downloadBackPicture()

        })
    }
    useMemo(downloadBackPicture, [userName])
    function downloadBackPicture() {
        //   console.log("start downloading back pic")
        //   if (!userName) { return null }
        axios.get(userName ? `${url}/backpicture/downloadbackpicture/${userName}` : isMobile ? "https://picsum.photos/500/800" : "https://picsum.photos/1000/800",
            {

                responseType: 'arraybuffer',
                onDownloadProgress: function (progressEvent) {
                    //     console.log("Downloading backPicture --- " + (progressEvent.loaded * 100 / progressEvent.total).toFixed(2))
                }
            }


        ).then((response) => {


            const base64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
            );


            setUserBackPicture("data:" + response.headers["content-type"] + ";base64," + base64)
        })
            .catch(err => { console.log(err.response) })


    }


    const [userAvatar, setUserAvatar] = useState();
    function uploadAvatar(pic) {

        if (!userName) { console.log("Please login first"); alert("please login first"); return null }

        const data = new FormData();
        data.append('file', pic);

        data.append('obj',
            JSON.stringify({
                filename: pic.name.trim(),
                ownerName: userName,
                uploadTime: Date.now(),

            })
        );


        axios.post(`${url}/avatar/uploadavatar`, data, {
            headers: { 'content-type': 'multipart/form-data' },


            responseType: 'arraybuffer',
            onUploadProgress: progressEvent => {
                let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
                console.log(percentCompleted);
                //  setProgress(percentCompleted+"%");
                //  percentCompleted === 100
                //     ? setPercentage("Finished")
                //    : setPercentage(percentCompleted + "%")
            },
        }).then((response) => {


            downloadAvatar()

        })







    }
    useMemo(downloadAvatar, [userName])
    function downloadAvatar() {

        if (!userName) { return null }
        axios.get(`${url}/avatar/downloadavatar/${userName}`,
            {

                responseType: 'arraybuffer',
                onDownloadProgress: function (progressEvent) {
                    //  console.log((progressEvent.loaded * 100 / progressEvent.total).toFixed(2))
                }
            }


        )
            .then((response) => {


                const base64 = btoa(
                    new Uint8Array(response.data).reduce(
                        (data, byte) => data + String.fromCharCode(byte),
                        '',
                    ),
                );

                setUserAvatar("data:" + response.headers["content-type"] + ";base64," + base64)
            })
            .catch(err => { console.log(err.response) })

    }


    const [picDataList, setPicDataList] = useState({})




    function login(userName, password) {
        axios.post(`${url}/user/login`, {
            userName,
            password

        }).then(response => {
            console.log(response.data)

            localStorage.setItem("token", response.headers["x-auth-token"])
            window.location.assign("/")
            console.log(jwtDecode(localStorage.getItem("token")));
        }).catch(err => {
            alert(err.response)
            console.log(err.response)
        })
    }

    function register(userName, password, theme) {
        axios.post(`${url}/user/register`, {
            userName,
            password,
            theme,

        }).then(response => {
            console.log(response.data)

            localStorage.setItem("token", response.headers["x-auth-token"])
            console.log(jwtDecode(localStorage.getItem("token")));

            window.location.assign("/")
        }).catch(err => {
            alert(err.response)
            console.log(err.response)
        })
    }

    function logout() {
        localStorage.removeItem("token")
        window.location.assign("/")
    }


    return (

        <UserContext.Provider value={{
            userName, setUserName,
            userBackPicture, setUserBackPicture, uploadBackPicture,
            userAvatar, setUserAvatar, uploadAvatar,
            login, register, logout, axios,
            picDataList, setPicDataList,
            friendsList, setFriendsList, uploadFriendsList,
            contentList, setContentList, downloadContentList, uploadContentList, deleteContentList,
            countContentNum, contentNum, setContentNum,

        }}>
            {props.children}
        </UserContext.Provider>

    );
}

export default UserContextProvider;

