const express = require("express");
const router = express.Router();

const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')



const [{ connDB, checkConnState, collectionName, getFileArray, deleteFileByUserName, uploadFile, downloadFile, isFileThere }] = require("../db/fileManager");
const { getSmallImageArray, makeStrangerAvatarAndSend,getAvatarImageArray} = require("../db/picManager");


router.post("/uploadavatar",


    authenticateToken,

    checkConnState,
    getFileArray,
    getAvatarImageArray,
    deleteFileByUserName,
    uploadFile,
    function (req, res) { res.json("upload done") }


)

router.get("/downloadavatar/:username",

    checkConnState,
    isFileThere,
   
    makeStrangerAvatarAndSend,


)

router.get("/getoriantation/:username",
    checkConnState,
    function (req, res) {

        connDB.db.collection(collectionName + ".files").findOne(
            { "metadata.ownerName": req.params.username }
        ).then(doc => {

            res.json(doc.metadata.oriantation)


        }).catch(err => { res.status("400").send("error in get user oriantation") })

    })




module.exports = router