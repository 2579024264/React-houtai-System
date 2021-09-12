import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'
import {
  Form,
  Icon,
  Input,
  Button
} from 'antd';
import {connect} from 'react-redux'

import './index.less'
import {login} from '../../redux/actions'

class Login extends Component {
  //这个是表单提交的函数
  handleSubmit = (event) => {
    //阻止事件的默认行为
    event.preventDefault()
    //提交表单之前，验证所有的表单规则是否满足
    this.props.form.validateFields(async(err,values)=>{
      //验证成功
      if(!err){
       const {username,password}=values
       //调用分发异步action的函数 => 发登录的异步请求，有了请求后
       await this.props.login(username,password)
      }else{
        console.log("验证失败!");
      }
    })
  
  }
  /**
   * 
   * @returns 对密码进行自定义验证
   */
   validatorPwd=(rule,value,callback)=>{
     if(!value){
       callback("密码必须输入")
     }else if(value.length<4){
       callback("密码长度不能小于4")
     }else if(value.length>12){
       callback("密码长度不能超过12")
     }else if( !/^[a-zA-Z0-9_]+$/.test(value)){
       callback("密码必须是英文，数字或下划线组成")
     }else{
       callback() //验证通过
     }
   }
  render() {
    //从redeuX中获取user数据
      const user =this.props.user
      //如果用户已经登录，自动跳转到管理界面
      if(user && user._id){
        return <Redirect to="/"/>
      }
      const errorMsg=user.errorMsg


    //得到功能强大的form对象,其中getFiledDecoreator是一个高阶函数
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login">
        <header className="login-header">
          React项目 后台管理系统
        </header>
        <section className="login-content">
          <div className={errorMsg ? 'error-msg show':'error-msg'}>{errorMsg}</div>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {
                getFieldDecorator('username', {
                  //声明式验证：直接使用逼人定义好的验证规则进行验证
                  rules:[
                    {required:true,message:"用户名必须输入"},
                    {min:4,message:"用户名的长度至少为4位"},
                    {max:12,message:"用户名的长度不能超过12位"},
                    {pattern:/^[a-zA-Z0-9_]+$/,message:"密码必须是英文，数字或下划线组成"}
                  ]
                  
                })(
                  <Input
                    prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    placeholder="用户名"
                  />,
                )
              }
            </Form.Item>
            <Form.Item>
              {
                getFieldDecorator('password', {
                  rules:[
                    {validator:this.validatorPwd}
                  ]
                })(
                  <Input
                    prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                    type="password"
                    placeholder="密码"
                  />,
                )
              }

            </Form.Item>
            <Form.Item>

              <Button type="primary" htmlType="submit" className="login-form-button">
                登录
              </Button>
            </Form.Item>
          </Form>
        </section>
      </div>
    )
  }
}
/**
 * 包装login组件生成一个新的组件form(Login)
 * 新组件会向login组件传递一个强大的对象属性：form
 * 
 */
const WrapLogin = Form.create()(Login)
export default connect(
  state=>({user:state.user}),
  {login}
)(WrapLogin) 
