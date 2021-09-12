/*
  包含n个action creator函数的模块
  同步action：对象{type:'xxx',data:数据值}
  异步action:函数dispatch=>{}
*/
import {
  SET_HEAD_TITLE,
  RECEIVE_USER,
  SHOW_ERROR_MSG,
  RESET_USER
} from './action-type'
import { reqLogin } from '../api'
import storageUtils from '../utils/storageUtils'
/*设置头部标题的同步action */
export const setHeadTitle=(headTitle)=>({type:SET_HEAD_TITLE,data:headTitle})

/*显示错误的用户的同步action */
export const showErrorMsg=(errorMsg)=>({type:SHOW_ERROR_MSG,errorMsg})

/*接收用户的的同步action */
export const receiverUser = (user) => ({type:RECEIVE_USER,user})

/*退出登录的同步action */
export const logout=()=>{
  //删除local中的user
  storageUtils.removeUser()
  //返回action对象
  return {type:RESET_USER}
}

/*登陆异步action */
export const login=(username,password)=>{
  return async dispatch =>{
    //1.执行异步的ajax请求
    const result=await reqLogin(username,password) //{status:0,data:user}{status:1,msg:'xxxx'}
    //2.1如果成功了，分发成功的同步action
    if(result.status===0){
      const user=result.data
      storageUtils.saveUser(user)
      //分发接收用户的同步action
      dispatch(receiverUser(user))
    }else{
      const msg=result.msg
      dispatch(showErrorMsg(msg))
    }
    //2.2如果失败，分发失败的同步action
  }
}