const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { User, BookList, Theme } = require("../db/schema")
const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')




const [{ getFileArray, deleteFileByUserName, uploadFile, downloadFile }] = require("../db/fileManager");



const [{ }, { deleteFileByUserName: deleteBackPictureByUserName, uploadFile: uploadBackPicture }] = require("../db/fileManager");


const { getSmallImageArray, makeAvatar, makeBackPicture, } = require("../db/picManager");


// User.findOne({ userName: "aaa" })
// .populate("articles")
// .then(doc => {
//       console.log(doc);
//    // res.json(doc.userTheme)
// }) 
// .catch(err=>{
//     console.log(err)
//    // res.status(500).json(err)
// })





router.get("/getfriendslist", authenticateToken, (req, res, next) => {

    User.findOne({ userName: req.user.userName })
        .then(doc => {
            res.json(doc.friendsList)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json(err)
        })

})

router.post("/updatefriendslist",authenticateToken,(req,res,next)=>{

  

    User.findOneAndUpdate({ userName: req.user.userName }, {friendsList:[...new Set(req.body)]}, { new: true })
    .then(doc=>{
        console.log(doc)
        res.json("friendsList updated")
    })
    .catch(err=>{
        console.log(err)
        res.status(500).json(err)
    })

})



router.get("/getusertheme", authenticateToken, (req, res, next) => {

    User.findOne({ userName: req.user.userName })
        .populate("userTheme")
        .then(doc => {
            //  console.log(doc);
            res.json(doc.userTheme)
        })
        .catch(err=>{
            console.log(err)
            res.status(500).json(err)
        })

})


router.post("/login", (req, res, next) => {

    User.findOne({ userName: req.body.userName })
        .then(user => {

            if (user) {
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    next()
                }
                else {
                    console.log("wrong password")
                    res.status(400).json("wrong password")
                }
            }
            else {
                res.status(401).son("no such user")
            }

        })
        .catch(err => {

            console.log(err);
            res.status(500).json(err)
        })

}, generateAndDispatchToken)

router.post("/register", (req, res, next) => {

    // console.log(req.body)

    // User.create({...req.body,password:bcrypt.hashSync(req.body.password)})
    // .then(doc=>{
    //     console.log(doc);
    //     res.json(doc);
    // })
    // .catch(err=>{
    //     console.log(err);
    //     res.status(500).json(err)
    // })


    try {

        User.create({ ...req.body, password: bcrypt.hashSync(req.body.password) })
            .then(doc => {

                Theme.create({ ownerId: doc._id, ownerName: doc.userName, theme: req.body.theme })
                    .then(result => {
                        next()
                    })
                    .catch(err => {
                        User.deleteOne({ _id: doc._id })
                        res.status(500).json("failed to create Theme in DB")
                    })
            })
            .catch(err => {


                if (err.code === 11000) {


                    console.log(err);
                    res.status(403).json("userName already exist")
                }
                else {
                    console.log(err.message);
                    res.status(500).json("failed to create User in DB")
                }
            })
    }
    catch (err) {

        console.log(err)
        res.status(500).json("failed to create in Server")
    }


}, makeAvatar, uploadFile, makeBackPicture, uploadBackPicture, generateAndDispatchToken)





module.exports = router