const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')



const [{ }, { }, { }, { checkConnState, downloadFile,  getFileArray, uploadFile }] = require("../db/fileManager");





router.get("/downloademoji/:username",

    function(req,res,next){

console.log(req.params.username)
        next()
    },
   
    downloadFile
)


router.post("/uploademoji",

//authenticateToken,
checkConnState,
getFileArray, 
uploadFile,
function (req,res,next){
    res.send("upload done")
}
   

)


module.exports = router