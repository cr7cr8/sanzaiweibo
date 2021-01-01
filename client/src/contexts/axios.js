import axios from "axios";



axios.interceptors.request.use(
  function fn1(request) {
  
    return request
  }
 
) 


axios.interceptors.response.use(

  function fn1(response) {
  
    return response
  }
 
)




if (getToken()) { axios.defaults.headers.common['x-auth-token'] = getToken() }


function getToken() {

  return localStorage.getItem("token")
}







const api = axios;
async function exec() {

  // First request will be served from network
  const response = await api.get('http://192.168.0.100/api/picture/downloadpicture/5fd0526dff03da27a48ce6d1',
    { responseType: 'arraybuffer', })

  // `response.request` will contain the origin `axios` request object


  alert(response.request.fromCache)

  // Second request to same endpoint will be served from cache
  let anotherResponse = await api.get('http://192.168.0.100/api/picture/downloadpicture/5fd0526dff03da27a48ce6d1',
    { responseType: 'arraybuffer', })

  // `response.request` will contain `fromCache` boolean
  alert(anotherResponse.request.fromCache)


  anotherResponse = await api.get('http://192.168.0.100/api/picture/downloadpicture/5fd0526dff03da27a48ce6d1',
    { responseType: 'arraybuffer', })

  // `response.request` will contain `fromCache` boolean
  alert(anotherResponse.request.fromCache)
}
//  exec()






export default axios;