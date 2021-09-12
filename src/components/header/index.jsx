import React, { Component } from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'
import {connect} from 'react-redux'
import './index.less'
import { reqWeather} from '../../api'
import LinkButton  from '../link-button'
import {logout} from '../../redux/actions'

class Header extends Component {
  //跟新时间和信息
  getTime=()=>{
    //每隔一秒获取当前的信息，并更新状态数据currentTime
   this.intervalId= setInterval(()=>{
      this.getWeather()
    },1000)
  }
  /*第一次render()之后执行一次
    一般再次执行异步操作：发ajax请求/启动定时器
  */
 getWeather=()=>{
    reqWeather().then(res=>{
    const info=res.data;
    this.setState({currentTime:info.lives[0].reporttime,weather:info.lives[0].weather})
  })
 }
 
  state={
    currentTime:'', //当前时间字符串
    weather:'',//天气的文本
  }

  /*退出登录
   */
  logout=()=>{
    //显示确认框
    Modal.confirm({
      content:"确认退出吗？",
      onOk:()=>{
      this.props.logout()
      },
     
    })
  }
  componentDidMount(){
    //获取天气信息
    this.getTime()
   }
   /*当前组件卸载之前调用 */
   componentWillUnmount(){
      //清除定时器
      clearInterval(this.intervalId)
   }
  render() {
    const username=this.props.user.username
    const {currentTime,weather}=this.state;
    //去除当前选中的标题
    const title=this.props.headTitle
    return (
      <div className="header">
        <div className="header-top">
          <span>欢迎,{username}</span>
          <LinkButton onClick={this.logout}>退出</LinkButton>
        </div>
        <div className="header-bottom">
          <div className="header-bottom-left">{title}</div>
          <div className="header-bottom-right">
            <span>{currentTime}</span>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default connect(
  state => ({headTitle:state.headTitle,user:state.user}),
  {logout}
)(withRouter(Header))