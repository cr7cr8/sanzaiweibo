const express = require("express");
const router = express.Router();
const { User, BookList, Theme, Article, Comment } = require("../db/schema")
const { authenticateToken, generateAndDispatchToken } = require('../middleware/auth')
const mongoose = require("mongoose");



router.post("/", authenticateToken,
    function (req, res, next) {

        Article.create({ ...req.body, }).then(doc => {

            doc._doc.commentNum = 0
            // console.log(doc)
            res.json(doc)
        })

    }
)

router.get("/delete/:id", authenticateToken,
    function (req, res, next) {

        Article.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(doc => {

            Comment.deleteMany({ articleId: mongoose.Types.ObjectId(req.params.id) }).then(doc => {
                res.send(doc._id)
            })


        })

    }
)


router.get("/count", authenticateToken,

    function (req, res, next) {
        User.findOne({ userName: req.user.userName }).then(doc => {

            let arr = doc.friendsList
            arr.push(req.user.userName)
            arr = [...new Set(arr)]
            const regx = new RegExp(arr.join("|"), "g")

            Article.countDocuments({ ownerName: regx, }).then(num=>{
                res.json(num)
            })

        })


    }

)


router.post("/all", authenticateToken,
    function (req, res, next) {


        User.findOne({ userName: req.user.userName }).then(doc => {

            let arr = doc.friendsList
            arr.push(req.user.userName)
            arr = [...new Set(arr)]
            const regx = new RegExp(arr.join("|"), "g")




            Article.find({ ownerName: regx, }).where("_id")
                .nin(req.body)
                .sort({ postingTime: -1 })
                .skip(0)
                .limit(5)
                .populate("articleComment").then(doc => {

                    // !!!Note: doc[0] does not equalt to {...doc[0]}
                    //    console.log ([{...doc[0],}])
                    //    console.log(doc[0]) 
                    const arr = []
                    doc.forEach(item => {
                        let obj = item._doc;
                        arr.push({ ...obj, commentNum: item.articleComment.length })
                    })
                    res.json(arr)
                })
        })


    }
)


router.get("/all", authenticateToken,
    function (req, res, next) {

        User.findOne({ userName: req.user.userName }).then(doc => {



            let arr = doc.friendsList
            arr.push(req.user.userName)
            arr = [...new Set(arr)]


            const regx = new RegExp(arr.join("|"), "g")


            Article.find({ ownerName: regx }).sort({ postingTime: -1 }).skip(0).limit(10).populate("articleComment").then(doc => {

                // !!!Note: doc[0] does not equalt to {...doc[0]}
                //    console.log ([{...doc[0],}])
                //    console.log(doc[0]) 
                const arr = []
                doc.forEach(item => {
                    let obj = item._doc;
                    arr.push({ ...obj, commentNum: item.articleComment.length })
                })
                res.json(arr)
            })


        })




    }
)


router.get("/all2", // authenticateToken,
    function (req, res, next) {
        Article.find({}).sort({ postingTime: -1 }).skip(0).limit(10).then(doc => {
            // console.log(doc)
            res.send(doc)
        })

    }
)


// router.get("/:username",// authenticateToken,
//     function (req, res, next) {
//         Article.find({ ownerName: req.params.username }).then(doc => {
//             console.log(doc)
//             res.send(doc)
//         })

//     }
// )






router.get("/delete/:id",
    function (req, res, next) {
        //   console.log("deleting poster " + req.params.id)
        Article.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) }).then(doc => {
            Comment.deleteMany({articleId:mongoose.Types.ObjectId(req.params.id)}).then(docs=>{
                res.send(doc)
            })
            
            
        })

    }


)



module.exports = router