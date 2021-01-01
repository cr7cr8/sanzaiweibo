const express = require("express");
const router = express.Router();
const { User, BookList, Theme, Article, Comment,SubComment } = require("../db/schema")
const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')
const mongoose = require("mongoose");


router.get("/count/:articleid",
    authenticateToken,
    function(req,res,next){
        Comment.count({articleId:req.params.articleid}).then(num=>{
            res.json(num)
        })

    }

)

router.post("/",
    authenticateToken,
    function (req, res, next) {
        Comment.create({ ...req.body, }).then(doc => {
            //console.log(doc)
            res.json(doc)
        })
    }
)

router.get("/:articleid",
    authenticateToken,
    function(req,res,next){
        Comment.find({articleId:req.params.articleid}).sort({ postingTime: -1 }).populate("commentSubComment").then(doc=>{

          
            const arr = []
            doc.forEach(item => {
                let obj = item._doc;
                arr.push({ ...obj, subCommentNum: item.commentSubComment.length })
            })
            res.json(arr)

          

        })

    }
)

router.get("/delete/:id",
    authenticateToken,
    function(req,res,next){
        Comment.deleteOne({_id:req.params.id}).then(doc=>{
             SubComment.deleteMany({commentId:req.params.id}).then(docs=>{

                res.json(doc)
             })


        
        })

    }

)




module.exports = router