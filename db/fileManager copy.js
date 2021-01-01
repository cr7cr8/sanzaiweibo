const multer = require("multer");
const mongoose = require("mongoose");
const GridFsStorage = require("multer-gridfs-storage");
const { connDB, connDB2, connDB3, connDB4 } = require("./db")
const Jimp = require('jimp');





function createFileManager(connDB, collectionName) {

    return {

        checkConnState: function (req, res, next) { checkConnState(connDB, collectionName, req, res, next) },
        getFileArray: multer({ storage: multer.memoryStorage() }).array("file", 789 /*789 is max count,default infinity*/),
        getSmallImageArray: function (req, res, next) { getSmallImageArray(connDB, collectionName, req, res, next) },
        uploadFile: function (req, res, next) { uploadFile(connDB, collectionName, req, res, next) },
        downloadFile: function (req, res, next) { downloadFile(connDB, collectionName, req, res, next) },
        deleteFileByUserName: function (req, res, next) { deleteFileByUserName(connDB, collectionName, req, res, next) },
        // makeBackPicture: function (req, res, next) { makeBackPicture(connDB, collectionName, req, res, next) },

        getIconImageArray:function (req, res, next) { getIconImageArray(connDB, collectionName, req, res, next) },
     
        connDB,
        collectionName,
        makeAvatar,
        makeBackPicture
    }
}

function checkConnState(connDB, collectionName, req, res, next) {


    let arr = ["   ", "   ", ".  ", ".  ", ".. ", ".. ", "...", "...",];
    let index = 0;
    function checking() {

        connDB.readyState === 1
            ? (function () {
                //    process.stdout.write(`Connecting ${collectionName}_Collection ...Connected!` + "\n");
                next()
            }())
            : (function () {
                process.stdout.write(`Connecting ${collectionName}_Collection ${arr[(index++) % arr.length]}` + "\r");
                setTimeout(checking, 123)
            }())
    }
    checking()


}


function getIconImageArray(connDB, collectionName, req, res, next, ) {

    req.files.forEach(function (imgFile, index) {

        Jimp.read(imgFile.buffer).then(function (image) {


            image.resize(100, Jimp.AUTO).quality(60)
                .getBufferAsync(image.getMIME())
                .then(function (imgBuffer) {
                    req.files[index].buffer = imgBuffer;
                    req.files[index].size = imgBuffer.length;
                    if (index === req.files.length - 1) { next() }
                })
                .catch(err => { console.log("error in converting small avatar image ", err) })

        })
    })

}


function getSmallImageArray(connDB, collectionName, req, res, next, ) {

    req.files.forEach(function (imgFile, index) {


        Jimp.read(imgFile.buffer).then(function (image) {

            const { width, height } = image.bitmap;
            req.files[index].oriantation = width >= height ? "horizontal" : "verticle"

            if (collectionName === "avatar") {

                image.resize(width <= height ? 100 : Jimp.AUTO, height <= width ? 100 : Jimp.AUTO)
                    .quality(60) //image.scale(0.2)//.getBase64Async(Jimp.MIME_JPEG)//.writeAsync("aaa.png")
                    .getBufferAsync(image.getMIME())
                    .then(function (imgBuffer) {
                        req.files[index].buffer = imgBuffer;
                        req.files[index].size = imgBuffer.length;
                        if (index === req.files.length - 1) { next() }
                    }).catch(err => { console.log("error in converting small avatar image ", err) })

            }
            else if (width * height >= 1000 * 1000) {
                image.resize(width >= height ? 1000 : Jimp.AUTO, height >= width ? 1000 : Jimp.AUTO)
                    .quality(60)
                    .getBufferAsync(image.getMIME())
                    .then(function (imgBuffer) {
                        req.files[index].buffer = imgBuffer;
                        req.files[index].size = imgBuffer.length;
                        if (index === req.files.length - 1) { next() }
                    }).catch(err => { console.log("error in converting small pic image ", err) })

            }
            else {


                if (index === req.files.length - 1) { next() }

            }



        }).catch(err => { console.log("error in Jimp reading file array ", err) })
    })

}



    
function uploadFile(connDB, collectionName, req, res, next) {


    req.body.obj =  typeof(req.body.obj)==="string"?JSON.parse(req.body.obj):req.body.obj
    req.files.forEach(function (file, index) {


        const gfs = new mongoose.mongo.GridFSBucket(connDB.db, {
            chunkSizeBytes: 255 * 1024,
            bucketName: collectionName,
            filename: file.originalname,

        });

        const { fieldname, originalname, encoding, mimetype, buffer, size, oriantation ,mongooseID} = file;
        const gfsws = gfs.openUploadStream(file.originalname, {
            chunkSizeBytes: 255 * 1024,


        
            metadata: { ...req.body.obj, fieldname, originalname, encoding, mimetype, size, oriantation ,
            
             mongooseID: String(mongooseID)
            },
            contentType: file.mimetype,
        })

        gfsws.write(file.buffer, function (err) { if (err) { console.log("error in uploading file ", err) } });
        gfsws.end(function () {

            req.files[index].mongooseID = gfsws.id
            
        
            if (index === req.files.length - 1) {
                console.log("==== All files uploading is done ===");

                

                next()
                //  res.json("upload done")
            }



        });

    })



}




function downloadFile(connDB, collectionName, req, res, next) {




    var gfs = new mongoose.mongo.GridFSBucket(connDB.db, {   //connDB3.db
        chunkSizeBytes: 255 * 1024,
        bucketName: collectionName,
        //  bucketName: "avatar",
    });

    const querryObj = req.params.username
        ? { 'metadata.ownerName': req.params.username }
        : { "_id": mongoose.Types.ObjectId(req.params.id) }


     


    const cursor = gfs.find({ ...querryObj }, { limit: 1 })
    // const cursor = gfs.find({ 'metadata.ownerName': req.params.username, /* "metadata.owner": req.user.username */ }, { limit: 1 })
    //const cursor = gfs.find({ /*'metadata.ownerName': req.params.username,  "metadata.owner": req.user.username */ }, { limit: 1000 })


    cursor.toArray().then(function (fileArr) {
        if (fileArr.length === 0 && collectionName === "avatar") {
            const randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16)
            // const text = req.params.username+"?"
            const text = "?"

            new Jimp(100, 100, randomColor, (err, image) => {


                Jimp.loadFont(Jimp.FONT_SANS_64_WHITE).then(function (font) {
                    return image.print(font, -20, 0, {
                        text: text,
                        alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                        alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                    }, 100, 100);
                }).then(function (image) {

                    Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(function (font) {
                        return image.print(font, 20, 0, {
                            text: text,
                            alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                            alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                        }, 100, 100);

                    }).then(function (image) {


                        image.getBufferAsync(image.getMIME()).then(function (imgBuffer) {


                            res.header('content-type', image.getMIME());
                            res.header("access-control-expose-headers", "content-type")
                            res.header("file-name", encodeURIComponent(req.params.username + "_.jpg"))
                            res.header("access-control-expose-headers", "file-name")

                            res.header("content-length", imgBuffer.length)
                            res.header("access-control-expose-headers", "content-length") // this line can be omitted
                            res.write(imgBuffer)

                            res.end("", function () {
                                console.log(" === stranger avatar sent done ===")
                            });

                        })




                    })


                })

            });

        }

        else if (fileArr.length === 0) { res.json("No files found to download") }

        fileArr.forEach(function (doc, index) {

            //   console.log(doc.metadata.oriantation)

            let gfsrs = gfs.openDownloadStream(doc._id);

            res.header('content-type', doc.contentType);
            res.header("access-control-expose-headers", "content-type")

            res.header("file-name", encodeURIComponent(doc.filename))
            res.header("access-control-expose-headers", "file-name")


            doc.metadata.oriantation && res.header("file-oriantation", doc.metadata.oriantation)
            doc.metadata.oriantation && res.header("access-control-expose-headers", "file-oriantation")


            res.header("content-length", doc.length)
            res.header("access-control-expose-headers", "content-length") // this line can be omitted

            gfsrs.on("data", function (data) {
                res.write(data);
            })

            gfsrs.on("close", function () {
                console.log(`------downloading  ${doc.filename} Done !----`);

                if (fileArr.length - 1 === index) {
                    res.end("", function () {
                        console.log(" === All files downloading is done ===")
                    });
                }
            })
        })


    })
}





function deleteFileByUserName(connDB, collectionName, req, res, next) {

    var gfs = new mongoose.mongo.GridFSBucket(connDB.db, {
        chunkSizeBytes: 255 * 1024,
        bucketName: collectionName,
    });
    const cursor = gfs.find({ 'metadata.ownerName': req.user.userName, /* "metadata.owner": req.user.username */ }, { limit: 1000 })

    cursor.toArray().then(function (fileArr) {
        if (fileArr.length === 0) { next() }
        fileArr.forEach(function (doc, index) {
            gfs.delete(mongoose.Types.ObjectId(doc._id), function (err) {
                err
                    ? console.log(err)
                    : console.log("file " + doc.filename + " " + doc.metadata.ownerName + " deleted");
                if (fileArr.length - 1 === index) {
                    next()
                }

            })

        })

    })

}








module.exports = [
    {
        ...createFileManager(connDB2, "avatar"),
    },
    {
        ...createFileManager(connDB3, "backPicture"),
    },
    {
        ...createFileManager(connDB4, "picture"),
        uploadFile_:uploadFile,
        downloadFile_:downloadFile,

    },
]




///////////////////////////



function makeAvatar(req, res, next) {




    //  const randomColor = Math.floor(Math.random() * 16777215);
    const randomColor = "#" + ((1 << 24) * Math.random() | 0).toString(16)

    new Jimp(100, 100, randomColor, (err, image) => {

        Jimp.loadFont(Jimp.FONT_SANS_16_WHITE).then(function (font) {
            return image.print(font, 0, -10, {
                text: req.body.userName,
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            }, 100, 100);
        }).then(function (image) {

            Jimp.loadFont(Jimp.FONT_SANS_16_BLACK).then(function (font) {
                return image.print(font, 0, 10, {
                    text: req.body.userName,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
                }, 100, 100);

            }).then(function (image) {


                image.getBufferAsync(image.getMIME()).then(function (imgBuffer) {


                    req.files = [{
                        buffer: imgBuffer,
                        mimetype: image.getMIME(),
                        oriantation: "verticle",
                        originalname: req.body.userName + ".png",
                        size: imgBuffer.length,
                    }];
                    req.body.obj = JSON.stringify({
                        ownerName: req.body.userName,
                        uploadTime: Date.now(),

                    })

                    console.log(imgBuffer.length)
                    image.quality(60)
                    next()
                    return image

                })




            })


        })

    });
}



function makeBackPicture(req, res, next) {

    var mainImage = new Jimp(100, 100, 0x0, function (err, image) {

        if (err) { return console.log("err in making BackPicture") }

        image.getBufferAsync(image.getMIME()).then(function (imgBuffer) {

            //    console.log(imgBuffer, image.getMIME())
            req.files = [{
                buffer: imgBuffer,
                mimetype: image.getMIME(),
                originalname: req.body.userName + "_backPicture.png",
                size: imgBuffer.length,
            }];
            req.body.obj = JSON.stringify({
                ownerName: req.body.userName,
                uploadTime: Date.now(),

            })

            //  console.log(req)

            console.log(imgBuffer.length)
            image.quality(60)
            next()
            return image

        })


        //     console.log(image.getBuffer(Jimp.AUTO))
        //    image.getBuffer()




    });

}   