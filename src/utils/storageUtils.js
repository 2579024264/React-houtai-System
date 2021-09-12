/*
  来保存读取user信息
*/
import store from 'store'
const USER_KEY = 'user_key'
export default {
//保存user
saveUser(user){
  //保存数据的json格式
  store.set(USER_KEY,user)
},
//读取user
getUser(){
  return store.get(USER_KEY) || {}

},
//删除user
removeUser(){
 store.remove(USER_KEY)
}
}