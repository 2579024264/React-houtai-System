import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message,
} from 'antd'

import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqDeleteUser, reqUsers,reqAddOrUpdateUser} from '../../api'
import {formateDate} from '../../utils/date'

import UserForm from './user-form'
/*用户路由 */
export default class User extends Component {

  state={
    users:[],//所有用户的列表
    roles:[],//所有角色的列表
    isShow:false,//确认框是否显示
  }
  /*根据role的数组，生成包含所有 角色名的对象(属性名用角色id值)*/
  initRoleName=(roles)=>{
    const roleNames=roles.reduce((pre,role)=>{
       pre[role._id]=role.name
       return pre
    },{})
    this.roleNames=roleNames
  }
  initColumns=()=>{
   this.columns=[
    {
      title:"用户名",
      dataIndex:'username'
    },
    {
      title:"邮箱",
      dataIndex:'email'
    },
    {
      title:"电话",
      dataIndex:'phone'
    },
    {
      title:"注册时间",
      dataIndex:'create_time',
      render:formateDate
    },
    {
      title:"所属角色",
      dataIndex:'role_id',
      render:(role_id)=>this.roleNames[role_id]
    },
    {
      title:"操作",
      render:(user)=>(
        <span>
          <LinkButton onClick={()=>{this.showUpdate(user)}}>修改</LinkButton>
          <LinkButton onClick={()=>this.deleteUser(user)}>删除</LinkButton>

        </span>
      )
    }
   ]
  }
  //删除指定用户
  deleteUser=(user)=>{
    Modal.confirm({
      title:`确认删除${user.username}`,
      onOk:async()=>{
      const result=await reqDeleteUser(user._id)
      if(result.status===0){
        message.success("删除用户成功!")
        this.getUsers()
      }

      }
    })
  }
  /*显示修改页面 */
  showUpdate=(user)=>{
    this.user=user //保存user
    this.setState({
      isShow:true
    })
  }
  /*显示添加页面 */
  showAdd=()=>{
    this.user=null  //去除当前保存的user
    this.setState({
      isShow:true
    })
  }
  //添加或者更新用户信息
  addOrUpdateUser=async()=>{ 
    this.setState({isShow:false})
    //1.收集输入数据
    const user=this.form.getFieldsValue()
    this.form.resetFields()
      //根据是更新还是添加来确定是否加入id属性，如果是更新的话就不用给元素添加id属性，直接交给后台
      //意思就是新添加的用户对象是没有id值。
    if(this.user){
      user._id=this.user._id
    }
    //2.提交添加的请求
    const result=await reqAddOrUpdateUser(user)
    //3.更新列表显示
    if(result.status===0){
      message.success(`${user._id ? '修改':'添加'}用户成功`)
      this.getUsers()
    }
  }
  //获取用户的信息
  getUsers=async()=>{
    const result =await reqUsers()
    if(result.status===0){
    const {users,roles}=result.data
    this.initRoleName(roles)
      this.setState({
        users,
        roles
      })
    }
  }
  componentWillMount(){
    this.initColumns()
  }
  componentDidMount(){
    this.getUsers()
  }
  render() {
    const {users,isShow,roles}=this.state
    const {user}=this
    const title =<Button type="primary" onClick={this.showAdd}>创建用户</Button>
    
    return (
      <Card title={title}>
         <Table 
            bordered
            dataSource={users} 
            columns={this.columns} 
            rowKey='_id'

            pagination={{
              // total,
              defaultPageSize:PAGE_SIZE,
              showQuickJUmper:true,
              onChange:this.getUsers
            }}
            // loading={loading}
       />;
          <Modal title={user ? '修改用户':'添加用户'}
            visible={isShow}
            onOk={this.addOrUpdateUser}
            onCancel={()=>{
              this.setState({isShow:false})
              this.form.resetFields()
              }}>
        {/* 通过传递一个函数，将子元素中额度数据传给父元素 */}
           <UserForm
              setForm={form=>this.form=form}
              roles={roles}
              user={user}
           />
          </Modal>
      </Card>
    )
  }
}
