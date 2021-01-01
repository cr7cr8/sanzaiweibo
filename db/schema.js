const mongoose = require("mongoose");
const { connDB } = require("./db")


const subCommentSchema = new mongoose.Schema({

    ownerName: { type: String },
    commentId: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String },
    postingTime: { type: Date, default: Date.now  },

}, {
    toObject: { virtuals: true },
    collection: "subcomments",
})


const commentSchema = new mongoose.Schema({

    ownerName: { type: String },
    articleId: { type: mongoose.Types.ObjectId, required: true },
    content: { type: String },
    postingTime: { type: Date, default: Date.now },
}, {
    toObject: { virtuals: true },
    collection: "comments",
})



const articleSchema = new mongoose.Schema({

    ownerName: { type: String },
    content: { type: String },
    postingTime: { type: Date, default: Date.now },


}, {
    toObject: { virtuals: true },
    collection: "articles",
    //  timestamps: true, 
})

const themeSchema = new mongoose.Schema({
    ownerName: { type: String },
    ownerId: { type: mongoose.Types.ObjectId, required: true },
    theme: { type: Object, required: true },

}, {
    toObject: { virtuals: true },
    collection: "themes",

})


const userSchema = new mongoose.Schema({
    themeId: { type: mongoose.Types.ObjectId },
    userName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        index: { unique: true },
        //     validate: [(val) => { return /\d{3}-\d{3}-\d{4}/.test(val) }, "please enter a valid userName"],

    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024
    },
    friendsList: [{ type: String }],
},
    {
        toObject: { virtuals: true },
        collection: "users",
        //  timestamps: true, 
    }

)


userSchema.virtual("userTheme", {
    localField: "_id",
    foreignField: "ownerId", ref: "themes",
    justOne: true
})

userSchema.virtual("userArticle", {
    localField: "userName",   //function(user){  console.log("***",user.friendsList[0]);  return user.friendsList[0] },
    //  localField:  function(user){  console.log("***",user.friendsList[0]);  return user.friendsList[1] },
    foreignField: "ownerName",
    //  foreignField:function(poster){ console.log("***",poster); return "bbb" },
    ref: "articles",
    justOne: false
})

articleSchema.virtual("articleComment", {
    localField: "_id",
    foreignField: "articleId",
    ref: "comments",
    justOne: false

})

commentSchema.virtual("commentSubComment", {
    localField: "_id",
    foreignField: "commentId",
    ref: "subcomments",
    justOne: false

})


/*
userSchema.virtual("listingBooks", {

    localField: "userName",
    foreignField: "owner", ref: "bookList",
    justOne: false
})

const bookListSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, minlength: 1, },
        author: { type: String, },
        owner: { type: String },
        id: { type: Number },
        finish: { type: Boolean, default: false },
        files:{type:Object,default:null},
        picture:{type:Boolean,default:false}

    },
    {
        //timestamps: true,
        collection: "bookList"
    }
)
*/




















const User = connDB.model("users", userSchema);
const Theme = connDB.model("themes", themeSchema);
const Article = connDB.model("articles", articleSchema);
const Comment = connDB.model("comments", commentSchema);
const SubComment = connDB.model("subcomments", subCommentSchema);

module.exports = { User, Theme, Article, Comment, SubComment }

