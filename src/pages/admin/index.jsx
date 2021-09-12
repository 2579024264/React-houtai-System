import React, { Component } from 'react'
import {Redirect,Route,Switch} from 'react-router-dom'
import {Layout} from 'antd'
import {connect} from 'react-redux'

import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'
import NotFound from '../not-found/not-found'



const {Footer,Sider,Content} =Layout;
 class Admin extends Component {
  render() {
    const user=this.props.user
    //如果当前内存中没有存储user===>说明当前用户并没有登陆
    if(!user || !user._id){
      //自动跳转到登陆界面  在render函数中实现跳转则使用Redirect
      return <Redirect to="/login"/>
    }
    return (
      <Layout style={{minHeight:'100%'}}>
      <Sider>
        <LeftNav/>
      </Sider>
      <Layout>
        <Header>Header</Header>
        <Content style={{backgroundColor:'#fff',margin:20}}>
          <Switch>
            <Redirect  exact from='/' to='/home'/>
            <Route  path="/home" component={Home}></Route>
            <Route  path="/category" component={Category}></Route>
            <Route  path="/product" component={Product}></Route>
            <Route  path="/role" component={Role}></Route>
            <Route  path="/user" component={User}></Route>
            <Route  path="/charts/bar" component={Bar}></Route>
            <Route  path="/charts/line" component={Line}></Route>
            <Route  path="/charts/pie" component={Pie}></Route>
            {/* 上面没有一个匹配，直接显示 */}
            <Route component={NotFound}/>  
          </Switch>
        </Content>
        <Footer style={{textAlign:'center',color:"#ccccc"}}>Footer</Footer>
      </Layout>
    </Layout>
    )
  }
}
export default connect(
  state=>({user:state.user}),
  {}
)(Admin)
