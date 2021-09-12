import React, { Component } from 'react'
import {
  Card,
  Button,
  Table,
  Modal,
  message
} from 'antd'
import {connect} from 'react-redux'

import {PAGE_SIZE} from '../../utils/constants'
import {reqRoles,reqAddRoles,reqUpdateRoles} from '../../api/index'
import {logout} from '../../redux/actions'

import AddForm from './add-form'
import AuthForm from './auth-form'
import { formateDate } from '../../utils/date'
import storageUtils from '../../utils/storageUtils'
class Role extends Component {

  myRef=React.createRef()

  state={
    roles:[],//所有角色的列表
    role:{},//选中的role
    isShowAdd:false,//是否显示添加页面
    isShowAuth:false,//是否显示权限修改页面
  }
  initColumn=()=>{
    this.columns=[
      {
        title:"角色名称",
        dataIndex:'name',
      },
      {
        title:"创建时间",
        dataIndex:'create_time',
        render:formateDate
      },
      {
        title:"授权时间",
        dataIndex:'auth_time',
        render:formateDate
      },
      {
        title:"授权人",
        dataIndex:'auth_name',
      },
    ]
  }
  //table中点击行触发函数
  onRow=(role)=>{
    return {
      onClick:event=>{  //点击行更新role的状态
        this.setState({
          role
        })
      },
    }
  }
  //获取角色列表信息
  getRoles=async()=>{
    const result=await reqRoles()
    if(result.status===0){
      const roles=result.data
      this.setState({
        roles
      })
    }
  } 
  //添加角色
  addRoles=()=>{
    //进行表单验证，只能通过了才能向下处理
    this.form.validateFields(async(error,values)=>{
      if(!error){
      //隐藏确认框
      this.setState({isShowAdd:false})
      //收集输入数据
        const {roleName}=values
        this.form.resetFields() 
        //请求添加
        const result=await reqAddRoles(roleName)
        if(result.status===0){
          message.success("添加角色成功")
          const role=result.data
          //更新roles状态
          const roles=[...this.state.roles]
          roles.push(role)
          this.setState({roles})

        }else{
          message.error("添加角色失败")
        }
      }
    })
    //根据结果提示/更新列表
  }

  //更新角色
   updateRoles=async()=>{
     //隐藏确认框
     this.setState({
       isShowAuth:false
     })
    const role=this.state.role
    //得到最新的menus 
    const menus=this.myRef.current.getCheckedKeys()
    role.menus=menus
    role.auth_time=Date.now()
    role.auth_name=this.props.user.username
    //请求更新
    const result=await reqUpdateRoles(role)
    if(result.status===0){
      //如果当前更新的是自己的权限，强制退出
      if(role._id===this.props.user.role_id){
        this.props.logout()
        message.success("当前用户角色权限修改了,请重新登录")
      }else{
      message.success('设置角色权限成功')
        this.setState({
          roles:[...this.state.roles]
        })
      }
     
    }
  }
  

  componentWillMount(){
    this.initColumn()
  }
  componentDidMount(){
    this.getRoles()
  }
  render() {
    const {roles,role,isShowAdd,isShowAuth}=this.state
    const title=(
      <span>
        <Button type="primary" style={{marginRight:20}} onClick={()=>this.setState({isShowAdd:true})}>创建角色</Button>
        <Button type="primary" disabled={role._id ? false:true} onClick={()=>this.setState({isShowAuth:true})}>设置角色权限</Button>
      </span>
    )
    return (
     <Card title={title}>
       <Table
       bordered
       dataSource={roles}
       columns={this.columns}
       rowKey="_id"
       pagination={{defaultPageSize:PAGE_SIZE}}
       rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect:(role)=>{  //选中某个radio时触发的回调
              this.setState({
                role
              })
            }
          }} //selectedRowKeys:[]是用来记录选中的用户行数据的key值从而实现选中的效果
       onRow={this.onRow}
       >
       </Table>
       <Modal title="添加角色"
          visible={isShowAdd}
          onOk={this.addRoles}
          onCancel={()=>{this.setState({isShowAdd:false})}}>
          <AddForm setForm={(form)=>this.form=form} />
        </Modal>
        <Modal title="设置角色权限"
          visible={isShowAuth}
          onOk={this.updateRoles}
          onCancel={()=>{this.setState({isShowAuth:false})}}>
          <AuthForm role={role}  ref={this.myRef}/>
        </Modal>
     </Card>
    )
  }
}
export default connect(
  state => ({user:state.user}),
  {logout}
)(Role)
