const express = require("express");
const router = express.Router();
const { User, BookList, Theme, Article, Comment, SubComment } = require("../db/schema")
const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')
const mongoose = require("mongoose");


router.get("/count/:commentid",
    authenticateToken,
    function(req,res,next){
 
        SubComment.count({commentId:req.params.commentid}).then(num=>{
            res.json(num)
        })

    }

)



router.post("/",
    authenticateToken,
    function (req, res, next) {
        SubComment.create({ ...req.body, }).then(doc => {
            //console.log(doc)
            res.json(doc)
        })
    }
)

router.get("/:commentid",
    authenticateToken,
    function(req,res,next){
      
        SubComment.find({commentId:mongoose.Types.ObjectId(req.params.commentid)}).sort({ postingTime: -1 }).then(doc=>{
          
            res.json(doc)
        })

    }
)

router.get("/delete/:id",
    authenticateToken,
    function(req,res,next){
        SubComment.deleteOne({_id:req.params.id}).then(doc=>{
            res.json(doc)
        })

    }
)



module.exports = router