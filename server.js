const express = require("express")
const app = express();


const user = require("./router/user")
const theme = require("./router/theme")
const avatar = require("./router/avatar")
const backPicture =  require("./router/backPicture")
const picture =  require("./router/picture")
const emoji =  require("./router/emoji")
const article =  require("./router/article")
const comment =  require("./router/comment")
const subComment =  require("./router/subComment")
const clientPack = require("./router/clientPack")



app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (!process.env.port) {
    const cors = require("cors");
    app.use(cors());
}



app.use("/api/user", user)
app.use("/api/theme", theme)
app.use("/api/avatar", avatar)
app.use("/api/backpicture",backPicture)
app.use("/api/picture",picture)
app.use("/api/emoji",emoji)
app.use("/api/article",article)
app.use("/api/comment",comment)
app.use("/api/subcomment",subComment)
app.get("*", clientPack)




app.listen(process.env.PORT || 80)