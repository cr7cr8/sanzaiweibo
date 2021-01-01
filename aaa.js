const GridFsStorage = require("multer-gridfs-storage");
const fs = require('fs')
//const path = require('path')
const mongoose = require("mongoose");
const { connEmojiDB: connDB } = require("./db/db.js")

const testFolder = 'C:/Users/Administrator/emoji';

const collectionName = "emoji"

let arr = ["   ", "   ", ".  ", ".  ", ".. ", ".. ", "...", "...",];
let index = 0;
let count = 0;
let isDroped = false
const emojiArr = [];

fs.readdirSync(testFolder)
  .forEach(file => {

    emojiArr.push(file.replace(".png",""));
    //console.log(   file.length  ); 
    const path = `${testFolder}/${file}`
    if (fs.lstatSync(path).isFile()) {

      const buffer = fs.readFileSync(path)


    //******
   //******* */  
  //    staging1(buffer, file)






    }

  });

 console.log(emojiArr.map(icon=>{

    return   toUnicodePair(icon) +"   ---   "+toUnicode(icon)
  }))

  



function staging1(buffer, filename) {






  connDB.readyState === 1
    ? (function () {


      // connDB.collection("dsd").drop(`${collectionName}_files`)
      // connDB.collection("dsd").drop(`${collectionName}_chunks`)


    //  process.stdout.write(`Connecting ${collectionName}_Collection ...Connected!` + "\n");

      if(!isDroped)   {
        connDB.collection(`${collectionName}.files`).drop()
        .then(function(){

          return connDB.collection(`${collectionName}.chunks`).drop()
        })
        .then(function(){
          isDroped = true;
          staging2(buffer, filename)
        })
        .catch(function(){
          isDroped = true
          staging2(buffer, filename)
        })

      }
      else{
        isDroped = true
        staging2(buffer, filename)
      }



      //  console.log("---", buffer.length, filename)

   //   staging2(buffer, filename)

    }())
    : (function () {
      process.stdout.write(`Connecting ${collectionName}_Collection ${arr[(index++) % arr.length]}` + "\r");
      setTimeout(function () { staging1(buffer, filename) }, 123)
    }())
}


function staging2(buffer, filename) {

  const gfs = new mongoose.mongo.GridFSBucket(connDB.db, {
    chunkSizeBytes: 255 * 1024,
    bucketName: collectionName,
    filename: filename,

  });

  //console.log(buffer.length)

  const gfsws = gfs.openUploadStream(filename, {
    chunkSizeBytes: 255 * 1024,



    metadata: {

      ownerName: filename,
      mimetype: "image/png",
      size: buffer.length,
      uploadTime: Date.now()
    },
    contentType: "image/png"
  })

  gfsws.write(buffer, function (err) { if (err) { console.log("error in uploading file ", err) } });

  gfsws.end(function () { 
  //  console.log(filename +" is done",++count)

    process.stdout.write( `${filename} = ${++count} | `);
  })

}


function toUnicode(theString){
let content ="";

   [...theString].forEach(item=>{
    content = content + "\\u{"+  item.codePointAt(0).toString(16).toUpperCase()+"}"
   })

  //content = theString.codePointAt(0).toString(16)
 
  return content
}

 
function toUnicodePair(theString) {
  var unicodeString = '';
  for (var i=0; i < theString.length; i++) {
    var theUnicode = theString.charCodeAt(i).toString(16).toUpperCase();
    while (theUnicode.length < 4) {
      theUnicode = '0' + theUnicode;
    }
   

    theUnicode = `\\`+'u' + theUnicode;
    unicodeString += theUnicode;
  }
  return unicodeString;
}