const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs")
const { User, BookList, Theme } = require("../db/schema")
const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')





router.get("/", authenticateToken, function (req, res) {

    Theme.findOne({ ownerName: req.user.userName })
        .then(data => {
       
            res.json(data)

        })
})

// router.post("/a",function(req,res){
//     Theme.create(req.body).then(data=>{
//         res.json(data)  


//     })
// })

router.post("/", authenticateToken,
    function (req, res, next) {

        Theme.findOneAndUpdate({ ownerName: req.user.userName }, req.body, { new: true })
            .then(data => {



                if (!Boolean(data)) {

                    User.findOne({ userName: req.user.userName }).then(data => {
                        Theme.create({ ownerId: data._id, ownerName: req.user.userName, ...req.body })
                    })
                }
                else {
              //      console.log("updated",data)
                    res.json(data)
                }

            })

    })







module.exports = router