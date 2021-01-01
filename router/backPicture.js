const express = require("express");
const router = express.Router();

const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')



const [{ }, { connDB, checkConnState, collectionName, getFileArray, deleteFileByUserName, uploadFile, downloadFile }] = require("../db/fileManager");
const { getSmallImageArray, } = require("../db/picManager");


router.post("/uploadbackpicture",

    authenticateToken,
    checkConnState,
    getFileArray,
    getSmallImageArray,
    deleteFileByUserName,
    uploadFile,

    function (req, res) { res.json("upload done") },



);

router.get("/downloadbackpicture/:username",

    checkConnState,
    downloadFile,


)

module.exports = router