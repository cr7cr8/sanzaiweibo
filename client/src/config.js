



let url=""

if(process.env.NODE_ENV === "development"){

   // url="http://localhost/api"
    url="http://192.168.0.103/api"
}
else{
    url="/api"

}









export default url;