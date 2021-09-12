import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Form,
  Input,
  Select,
} from 'antd'

const Item =Form.Item
const Option=Select.Option
 class UserForm extends Component {
  
  static propTypes={
    setForm:PropTypes.func.isRequired,
    roles:PropTypes.array.isRequired,
    user:PropTypes.object
  }
  componentWillMount(){
    this.props.setForm(this.props.form)
  }
  render() {
    const {roles}=this.props
    const user=this.props.user || {}
    console.log(user.username);
    const formItemLayout={
      labelCol:{span:4}, 
      wrapperCol:{span:17},
  }
    const {getFieldDecorator}=this.props.form
    return (
     
      <Form {...formItemLayout}>
        <Item label='用户名'>
          {
            //这里的username...名称最后要与后台中的username相对应，所以一定要规范书写
            getFieldDecorator('username',{
              initialValue:user.username,
              rules:[
                {required:true,message:"用户名必须输入"}
              ]
            })(
              <Input placeholder="请输入用户名称"/>
            )
          }
        </Item>
        {/* 下面这一行表示如果是修改则不显示密码这一栏 */}
        {user._id ? null :(
           <Item label='密码'>
           {
             getFieldDecorator('password',{
              initialValue:user.password,
               rules:[
                 {required:true,message:"密码必须输入"}
               ]
             })(
               <Input placeholder="请输入密码"/>
             )
           }
         </Item>
        )
        }
       
        <Item label='手机号'>
          {
            getFieldDecorator('phone',{
              initialValue:user.phone,
              rules:[
                {required:true,message:"手机号必须输入"}
              ]
            })(
              <Input placeholder="请输入手机号"/>
            )
          }
        </Item>
        <Item label='邮箱'>
          {
            getFieldDecorator('email',{
              initialValue:user.email,
              rules:[
                {required:true,message:"邮箱必须输入"}
              ]
            })(
              <Input placeholder="请输入邮箱"/>
            )
          }
        </Item>
        <Item label='角色'>
          {
            getFieldDecorator('role_id',{
              initialValue:user.role_id,
              rules:[
                {required:true,message:"邮箱必须输入"}
              ]
            })(
              <Select>
              {
                roles.map(role=><Option key={role._id} value={role._id}>{role.name}</Option>)
              }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)
