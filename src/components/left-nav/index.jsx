import React, { Component } from 'react'
import {Link,withRouter} from 'react-router-dom' 
import { Menu, Icon } from 'antd'
import {connect} from 'react-redux'

import './index.less'
import menuList from '../../config/menuConfig'
import {setHeadTitle} from '../../redux/actions'
const { SubMenu } = Menu
/*
  左侧导航的组件
*/
 class LeftNav extends Component {

  /*
    判断当前登录用户对item是否有权限
  */
  hasAuth=(item)=>{
    const {key,isPublic}=item
    const menus=this.props.user.role.menus
    const username=this.props.user.username

    /*
      1.如果当前用户是admin
      2.如果当前item是公开的
      3.当前用户有此item的权限：key有没有在menus中
    */
   if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
     return true
   }else if(item.children){   //如果当前用户有此item的某个子item的权限
      //下面!!表示find返回的是一个对象，加!!后强制转换成了布尔值
     return !!item.children.find(child => menus.indexOf(child.key)!==-1)
   }
   return false 


  }
  /*
    根据menu的数据数组生成对应的标签数组
    使用map()+递归调用
  */
  getMenuNodes_map=(menuList)=>{
    return  menuList.map(item=>{
        if(!item.children){
          return (
            <Menu.Item key={item.key}>
                <Link to={item.key}>
                  <Icon type={item.icon}></Icon>
                  <span>{item.title}</span>
                </Link>
            </Menu.Item>
          )
        }else{
          return(
            <SubMenu
              key={item.key}
              title={
                <span>
                  <Icon type={item.icon}></Icon>
                  <span>{item.title}</span>
                </span>
              } 
            >
              {this.getMenuNodes(item.children)}
            </SubMenu>
          )
        }
      })
  }
  /*使用reduce方法+递归实现 */
  getMenuNodes=(menuList)=>{
    const path=this.props.location.pathname;
      return menuList.reduce((pre,item)=>{

        //如果当前用户有item对应的权限，才需要显示对应的菜单项
        if(this.hasAuth(item)){
          //向pre中添加<Menu.Item> 
          //判断item是否是当前对应的item
          if(!item.children){
            if(item.key===path || path.indexOf(item.key)===0){
              //更新headerTitle状态
              this.props.setHeadTitle(item.title)
            }
          pre.push((
                <Menu.Item key={item.key}>
                  <Link to={item.key} onClick={()=>this.props.setHeadTitle(item.title)}>
                    <Icon type={item.icon}></Icon>
                    <span>{item.title}</span>
                  </Link>
                </Menu.Item>
              ))
            
          }else{
            //查找一个与当前请求路径匹配的Item
            const cItem=item.children.find(cItem=>path.indexOf(cItem.key)===0)
            //如果存在，说明当前的item的子列表需要打开
            if(cItem){
              this.openKey=item.key
            }
            pre.push((
              <SubMenu
                  key={item.key}
                  title={
                    <span>
                      <Icon type={item.icon}></Icon>
                      <span>{item.title}</span>
                    </span>
                  } 
              >
                  {this.getMenuNodes(item.children)}
              </SubMenu>
            ))
          }
          
        }
        return pre

    
      },[])
  }
  /*在第一次render()之前执行一次
    为第一个redner()准备数据(必须是同步的)
  */
  componentWillMount(){
    this.menuNodes=this.getMenuNodes(menuList)
  }
  render() {
   
    //得到当前请求的路由路径
    let path=this.props.location.pathname;
    if(path.indexOf('/product')===0){ //当前请求的是商品或其子路由界面
      path='/product'
    }
    //得到需要打开菜单项的key值
    const openKey=this.openKey;
    return (
      <div>
        <Link to='/' className="left-nav">
          <header className="left-nav-header">
              <h1>后台管理系统</h1>
          </header>
       </Link>
       <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[path]}
        defaultOpenKeys={[openKey]}
       >
       {
        this.menuNodes
       }
       </Menu>
      </div>
    
    )
  }
}
/*
  withRouter这是一个高阶组件：包装一个非路由组件，返回一个新的组件
  新的组件向非路由组件传递三个属性，loaction,match,history
*/
export default connect(
  state=>({user:state.user}),
  {
    setHeadTitle
  }
)(withRouter(LeftNav)) 