const mongoose = require("mongoose")
mongoose.connection.on('error', function (err) {
    // console.log('Mongoose default connection error: ' + err);

    console.log("aaaaaaaaaaaaaaa")
});

const { connDB, connDB2, connDB3, connDB4, connEmojiDB, DB, EmojiDB, connParam } = {

    //  DB: "mongodb+srv://boss:ABCabc123@cluster0-iiqnu.azure.mongodb.net/WebFrame?poolSize=10&retryWrites=true&w=majority",

    DB: "mongodb+srv://boss:ABCabc123@cluster0-lsf8g.azure.mongodb.net/Webframe?retryWrites=true&w=majority",
    EmojiDB: "mongodb+srv://boss:ABCabc123@cluster0-lsf8g.azure.mongodb.net/EmojiDB?retryWrites=true&w=majority",

    connParam: { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false,/*poolSize:10*/ },

    get connDB() {
        return mongoose.createConnection(this.DB, this.connParam)
    },
    get connDB2() {
        return mongoose.createConnection(this.DB, this.connParam)
    },
    get connDB3() {
        return mongoose.createConnection(this.DB, this.connParam)
    },
    get connDB4() {
        return mongoose.createConnection(this.DB, this.connParam)
    },
    get connEmojiDB() {
        return mongoose.createConnection(this.EmojiDB, this.connParam)
    },



}





function wrapAndMerge(...args) {

    return args.map(function (fn) {
        return {
            [fn.name]: function (req, res, next) {
                try {
                    const obj = fn(req, res, next);
                    return (Promise.resolve(obj) === obj)
                        ? obj.catch(ex => res.send(`<h1>Async error from function <br> ${fn.name}<br> ${ex}</h1>`))
                        : obj
                }
                catch (ex) { res.send(`<h1>something wrong when calling function  <br> ${fn.name}<br></h1> ${ex.stack}`) }
            }
        }
    }).reduce(
        function (accumulator, currentValue) {
            return { ...accumulator, ...currentValue }
        })
}

module.exports = {
    connDB,
    connDB2,
    connDB3,
    connDB4,
    connEmojiDB,
    wrapAndMerge,
}
