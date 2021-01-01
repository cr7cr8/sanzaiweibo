import React, { useContext, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import styled, { ThemeProvider, css, keyframes } from "styled-components";
import { UserContext } from './contexts/UserContextProvider';
import { ThemeContext } from './contexts/ThemeContextProvider';
import { useMediaQuery } from 'react-responsive';
import axios from './contexts/axios';


import url from "./config";
 
const Div = styled.div`
 
display:flex;
justify-content:center;
background-color:pink;

        /* ${function ({ theme }) { return theme.fontSize2 }} */
width: ${function ({ theme, isSmall }) {

        return isSmall ? Number(theme.avatarSize.replace("px", "")) / 2 + "px" : theme.avatarSize
    }} ;
height:${function ({ theme, isSmall }) { return isSmall ? Number(theme.avatarSize.replace("px", "")) / 2 + "px" : theme.avatarSize }} ;


overflow:hidden;

border-radius:1000px;

box-shadow:   ${function ({ theme, isSmall }) { return  isSmall?"":"0px 0px 6px #5f5f5f;" } };


`


const Img = styled.img.attrs(
    function ({ oriantation, theme, isSmall }) {

        if (oriantation === "horizontal") {
            return {

                height: isSmall ? Number(theme.avatarSize.replace("px", "")) / 2 + "px" : theme.avatarSize

                //height: `${theme.avatarSize}`
            }
        }

        if (oriantation === "verticle") {
            return {
                width: isSmall ? Number(theme.avatarSize.replace("px", "")) / 2 + "px" : theme.avatarSize

                //width:  `${theme.avatarSize}`

            }
        }

    }

)`
position:relative;
display:inline;


`



export default function Avartar({ peopleName, ...props }) {



    const {
        userAvatar,
        userState,
        axios,
    } = useContext(UserContext)

    const {

    } = useContext(ThemeContext)




    const people = peopleName
        ? userState
            ? userState.userName === peopleName
                ? null
                : peopleName : peopleName
        : null



    const [oriantation, setOriantation] = useState("verticle")
    useMemo(function () {
        (people || userState) && axios.get(`${url}/avatar/getoriantation/${people ? people : userState.userName}`)
            .then((response) => {
                setOriantation(response.data)

            })

    }, [people, userState, userAvatar])

    const isSmall = props.isSmall;

    return (
        <>


            {(people || userState) && <Div className="avatar" isSmall={isSmall}>
                <div href={"/" + people || userState.userName} download="pic_logo" style={{ cursor: "default", }}

                    onClick={
                        function (e) {

                            // props.onClick
                            //     ? props.onClick(e)
                            //     : alert(people || userState.userName)

                        }}
                >
                    <Img title={people || userState.userName}
                        oriantation={oriantation}
                        src={people ? `${url}/avatar/downloadavatar/${people}` : userAvatar}
                        download="dsd" alt={people || userState.userName + " logo"}
                        style={{ objectFit: "contain", }}
                        isSmall={isSmall}
                        onClick={props.onClick}
                    />

                </div>


            </Div>}

        </>
    );
}


export function AvartarSmall({ peopleName, ...props }) {



    const {
        userAvatar,
        userState,
        axios,
    } = useContext(UserContext)

    const {

    } = useContext(ThemeContext)




    const people = peopleName
    // ? userState
    //     ? userState.userName === peopleName
    //         ? null
    //         : peopleName : peopleName
    // : null



    const [oriantation, setOriantation] = useState("verticle")

    // axios.get(`${url}/avatar/getoriantation/${people}`)
    //     .then((response) => {
    //         setOriantation(response.data)

    //     })



    const isSmall = props.isSmall;

    return (



        <Div className="avatar" isSmall={isSmall} style={{ ...props.style }}    >
            <div href={"/" + people || userState.userName} download="pic_logo" style={{ cursor: "default", }}>
                <Img title={people || userState.userName}
                    oriantation={oriantation}
                    src={ `${url}/avatar/downloadavatar/${people}` }
                    download="dsd" alt={people }
                    style={{ objectFit: "contain", }}
                    isSmall={isSmall}


                />

            </div>
        </Div>




    );

}

