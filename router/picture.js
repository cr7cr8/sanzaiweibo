const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')



const [{ }, { }, { connDB, collectionName, uploadFile_, downloadFile_, getFileIDList, checkConnState, getFileArray, deleteFileByUserName, uploadFile, downloadFile, deleteFileById_ }] = require("../db/fileManager");
const { getSmallImageArray, getIconImageArray } = require("../db/picManager");


router.get("/getpictureid/:username",
    checkConnState,
    function (req, res, next) {

        const obj = {}
        connDB.db.collection(collectionName + "_icon.files").find({
            "metadata.ownerName": req.params.username
        }, function (err, cursor) {

            if (err) { console.log(err); res.status(500).send(err) }
            else {
                cursor
                    .forEach(function (item) { if (item.metadata.mongooseID) { obj[item._id] = item.metadata.mongooseID } })
                    .then(function () {
                        console.log(obj)
                        res.send(obj)
                    })
            }
        })
    }


);



router.post("/uploadpicture",

    authenticateToken,
    checkConnState,
    getFileArray,
    getSmallImageArray,

    uploadFile,

    function (req, res, next) {

        const mongooseIDArr = [];
        req.files.forEach(function (item, index) {
            mongooseIDArr.push(item.mongooseID)
        })




        req.imgid = mongooseIDArr.pop()
        next()
    },

    getIconImageArray,


    // uploadIconImage,
    function uploadIconImage(req, res, next) {

        uploadFile_(connDB, collectionName + "_icon", req, res, next)

    },
    function (req, res, next) {

        const mongooseIDArr = [];
        req.files.forEach(function (item, index) {
            mongooseIDArr.push(item.mongooseID)
        })
        req.iconid = mongooseIDArr.pop()

        res.json([req.iconid, req.imgid])
    }



);



router.get("/downloadiconpicture/:id",

    authenticateToken,
    checkConnState,


  
    function (req, res, next) {

        downloadFile_(connDB, collectionName + "_icon", req, res, next)

    },


)

router.get("/downloadpicture/:id",



//    authenticateToken,
    checkConnState,
    downloadFile,


)

router.get("/deleteiconpicture/:iconid/:picid",

    function (req, res, next) {
        req.params.id = req.params.iconid;
        deleteFileById_(connDB, collectionName + "_icon", req, res, next)
    },
    function (req, res, next) {
        req.params.id = req.params.picid;
        deleteFileById_(connDB, collectionName, req, res, next)
    },
    function (req, res, next) {
        res.send("file deleted")
    },

)



module.exports = router

