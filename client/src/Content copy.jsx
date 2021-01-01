import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import { useMediaQuery } from 'react-responsive';
import axios from './contexts/axios';

const Div = styled.div`

display:flex;
justify-content:center;
align-items:center;
flex-direction:column;

`





const Content = () => {



// useMemo( function(){
//     axios({
//         method: 'get',
//       //  url: 'http://bit.ly/2mTM3nY',
//         url: "https://cors-anywhere.herokuapp.com/https://wx1.sinaimg.cn/mw690/67d93ef0gy1ghg8svpi82j22342s5qv5.jpg",
//         responseType: 'blob'
//       })
//         .then(function (response) {
           
//           console.log(response.data)
//           const url = window.URL.createObjectURL(new Blob([response.data],{type:"image/jpeg"}));
//           const link = document.createElement('a');
//           link.href = url;
//           link.setAttribute('download', decodeURIComponent(response.headers["file-name"]));
//           document.body.appendChild(link);
//           link.click();
//         });
//     },[])







    const count = useRef(0);
    useEffect(function () {
        console.log("painting Content --- ", count.current)
        return function () {
            count.current++;
        }
    })

    const { } = UserContext;
    const { } = ThemeContext;
    const index = useRef(0)

    const loadImage = useCallback(function () {
        return axios({
            //   url: "https://cors-anywhere.herokuapp.com/https://wx1.sinaimg.cn/mw690/67d93ef0gy1ghg8svpi82j22342s5qv5.jpg",
            // url: "https://cors-anywhere.herokuapp.com/https://gdb.voanews.com/2174CE36-9B02-4292-A9F6-0A598A706A12_cx0_cy11_cw0_w1597_n_r1_st.jpg",
            url: "https://picsum.photos/200/300",

            method: 'GET',
            responseType: 'arraybuffer', // important

        }).then((response) => {

            const base64 = btoa(
                new Uint8Array(response.data).reduce(
                    (data, byte) => data + String.fromCharCode(byte),
                    '',
                ),
            );

            return "data:" + response.headers["content-type"] + ";base64," + base64

        }).catch(err => {
            console.log(err.response);

        })



    }, [])

    const loadText = useCallback(function () {
        index.current++;
        return axios({
            url: `https://jsonplaceholder.typicode.com/photos/${index.current}`,

            method: 'get',

            data: {
                firstName: 'Fred',
                lastName: 'Flintstone'
            }
        })
            .then((response) => {
               
                return response.data


            })
            .catch(err => {
                console.log(err.response)
            })

    })




    useEffect(function () {
        const config = {
            root: null, //document.getElementById("content"),
            rootMargin: '0px 0px 0px 0px',
            // threshold: [0,0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9],
            threshold: [0.1],
        };

        let observer = new IntersectionObserver(function (entries, self) {

            entries.forEach(entry => {
             
                if (entry.intersectionRatio >=0.1) {

                    // alert(entry.target.innerHTML)
                    // console.log(entry.target.innerHTML)
                    if (photos.length < 30) {

                        loadImage().then(src => {
                            setPhotos(pre => {
                                return [...pre, src]
                            })
                        })

                        // loadText().then(data => {
                        //     setTexts(pre => {
                        //         return [...pre, data]
                        //     })
                        // })
                    }
                    // self.unobserve(entry.target);
                }
                else {
                    //self.unobserve(entry.target);
                }

            });
        }, config);

        const arr = document.querySelectorAll('#endDiv');
        arr.forEach(function (el) {
            console.log(el.children)
            observer.observe(el)
        })


        return function () {


            observer.disconnect();
        }

    })



    const [photos, setPhotos] = useState(["https://picsum.photos/200/300"]);
    const [texts, setTexts] = useState([]);


    return (
        <Div id="content">

            {photos.map(function (msg, index) {
                return (
                    <div key={index}><img style={{ minHeight: "300px", margin: "0px", display: "block" }} src={msg} /></div>
                )
            })}

            {/* {texts.map(function (msg, index) {
                return (
                    <div key={index}>{msg.title}</div>
                )
            })} */}


            <div id="endDiv"> === </div>
        </Div>

    );
}

export default Content;

   // const config = {
    //   root: null,
    //   rootMargin: '0px 0px 50px 0px',
    //   threshold: 0
    // };

    // register the config object with an instance
    // of intersectionObserver
    // let observer = new IntersectionObserver(function(entries, self) {
    //   // iterate over each entry
    //   entries.forEach(entry => {
    //     // process just the images that are intersecting.
    //     // isIntersecting is a property exposed by the interface
    //     if(entry.isIntersecting) {
    //       // custom function that copies the path to the img
    //       // from data-src to src
    //      // preloadImage(entry.target);
    //       // the image is now in place, stop watching
    //      // self.unobserve(entry.target);

    //     }
    //     alert(entry.target)
    //     console.log(entry.target) 
    //   });
    // }, config);

    // observer.observe(document.getElementById("bbb"))