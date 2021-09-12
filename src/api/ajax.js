/*
  能发送异步ajax请求的函数模块
  封装axios库
  函数的返回值是一个promise对象
  1.优化：统一处理请求异常
    在外层包一个自己创建的promise对象
    在请求出错时，不用reject（error)而是显示错误提示
*/
import { message } from 'antd';
import axios from 'axios'

export default function ajax(url,data={},type="GET"){
  return new Promise((resolve,reject)=>{
    let promise;
    if(type==='GET'){
     promise= axios.get(url,
      {
        params:data
      }    
    )
    }else{  //发送POST请求
      promise= axios.post(url,data)
    } 
    //使得返回的promise携带数据
    promise.then(response=>{
      resolve(response.data)
    }).catch(error=>{
      //这里的出错是因为请求本身出错，跟结果无关
      message.error("请求出错了:"+error.message)
    })
  })
  
}